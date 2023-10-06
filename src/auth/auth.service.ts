import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import { IBasicResponse, IResponseJWT } from 'src/types/responses';
import * as bcrypt from 'bcrypt';
import { ICheckUserEmailResponse } from 'src/types/responses/users';

interface IJWT {
  id: number;
  email: string;
  isAdmin: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto): Promise<IResponseJWT | IBasicResponse> {
    const response: ICheckUserEmailResponse | HttpException =
      await this.userService.checkUniquenessOfEmail(userDto.email);

    if (response.status !== 200) {
      return response;
    }

    const hashPassword: string = await bcrypt.hash(userDto.password, 10);
    const newUser: User = await this.userService.createUser({ ...userDto, password: hashPassword });
    return this.generateToken(newUser);
  }

  private async generateToken(user: User): Promise<IResponseJWT> {
    const payload: IJWT = { id: user.id, email: user.email, isAdmin: user.isAdmin };
    return { token: this.jwtService.sign(payload) };
  }
}
