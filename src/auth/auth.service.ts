import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import { IRefreshToken, TokensService } from 'src/tokens/tokens.service';
import { ILoginUserData } from 'src/types/requests/users';
import { Token } from 'src/tokens/tokens.model';
import {
  makeNotCorrectPassMessage,
  makeNotFoundMessage,
  makeUnauthorizedMessage,
} from 'src/utils/generators/messageGenerators';
import {
  ICheckUserEmailResponse,
  IRefreshResponseJWT,
  IRegistrationResponseJWT,
  ILoginResponse,
} from 'src/types/responses/users';

export interface ITokensCreationResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokensService: TokensService,
  ) {}

  async refresh(refreshToken: string): Promise<IRefreshResponseJWT> {
    if (!refreshToken) {
      throw new HttpException(makeUnauthorizedMessage(), HttpStatus.UNAUTHORIZED);
    }

    const userDataFromToken: IRefreshToken | null =
      this.tokensService.validateRefreshToken(refreshToken);
    const tokenFromDB: Token = await this.tokensService.findTokenInDB(refreshToken);

    if (!userDataFromToken || !tokenFromDB) {
      throw new HttpException(makeUnauthorizedMessage(), HttpStatus.UNAUTHORIZED);
    }

    const user: User = await this.userService.getUserInformation(userDataFromToken.id);

    if (!user) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    const tokens: ITokensCreationResponse = await this.tokensService.generateToken(user);
    await this.tokensService.saveToken(user.id, tokens.refreshToken);

    const response: IRefreshResponseJWT = {
      status: HttpStatus.OK,
      data: { ...tokens, user: user },
    };
    return response;
  }

  async registration(
    userDto: CreateUserDto,
  ): Promise<IRegistrationResponseJWT | ICheckUserEmailResponse> {
    const emailUniqueResponse: ICheckUserEmailResponse | HttpException =
      await this.userService.checkUniquenessOfEmail(userDto.email);

    if (emailUniqueResponse.status !== 200) {
      return emailUniqueResponse;
    }

    const hashPassword: string = await bcrypt.hash(userDto.password, 10);
    const newUser: User = await this.userService.createUser({ ...userDto, password: hashPassword });

    const tokens: ITokensCreationResponse = await this.tokensService.generateToken(newUser);
    await this.tokensService.saveToken(newUser.id, tokens.refreshToken);

    const response: IRegistrationResponseJWT = {
      status: HttpStatus.CREATED,
      data: { ...tokens, createdUser: newUser },
    };
    return response;
  }

  async login(userData: ILoginUserData): Promise<ILoginResponse> {
    const user: User | null = await this.userService.findUserByEmail(userData.email);

    if (!user) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    const isPasswordsEquals: boolean = await bcrypt.compare(userData.password, user.password);

    if (!isPasswordsEquals) {
      throw new HttpException(makeNotCorrectPassMessage(), HttpStatus.UNAUTHORIZED);
    }

    const tokens: ITokensCreationResponse = await this.tokensService.generateToken(user);
    await this.tokensService.saveToken(user.id, tokens.refreshToken);

    const response: ILoginResponse = {
      status: HttpStatus.OK,
      data: { ...tokens, userData: user },
    };

    return response;
  }
}
