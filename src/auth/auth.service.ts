import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import { ICheckUserEmailResponse, IResponseJWT } from 'src/types/responses/users';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokensService: TokensService,
  ) {}

  async login(userDto: CreateUserDto): Promise<IResponseJWT | ICheckUserEmailResponse> {
    const response: ICheckUserEmailResponse | HttpException =
      await this.userService.checkUniquenessOfEmail(userDto.email);

    if (response.status !== 200) {
      return response;
    }

    const hashPassword: string = await bcrypt.hash(userDto.password, 10);
    const newUser: User = await this.userService.createUser({ ...userDto, password: hashPassword });

    return this.tokensService.generateToken(newUser);
  }
}
