import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import { ICheckUserEmailResponse, IResponseJWT } from 'src/types/responses/users';
import { TokensService } from 'src/tokens/tokens.service';

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

  async login(userDto: CreateUserDto): Promise<IResponseJWT | ICheckUserEmailResponse> {
    const emailUniqueResponse: ICheckUserEmailResponse | HttpException =
      await this.userService.checkUniquenessOfEmail(userDto.email);

    if (emailUniqueResponse.status !== 200) {
      return emailUniqueResponse;
    }

    const hashPassword: string = await bcrypt.hash(userDto.password, 10);
    const newUser: User = await this.userService.createUser({ ...userDto, password: hashPassword });

    const tokens: ITokensCreationResponse = await this.tokensService.generateToken(newUser);
    await this.tokensService.saveToken(newUser.id, tokens.refreshToken);

    const response: IResponseJWT = { ...tokens, createdUser: newUser };
    return response;
  }
}
