import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';

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

  async login(userDto: CreateUserDto) {
    const responseOfCheckingUniqueness = await this.userService.checkUniquenessOfEmail(
      userDto.email,
    );

    if (responseOfCheckingUniqueness.status !== 200) {
      return responseOfCheckingUniqueness;
    }

    const hashPassword: string = await bcrypt.hash(userDto.password, 10);
    const newUser: User = await this.userService.createUser({ ...userDto, password: hashPassword });
    return this.generateToken(newUser);
  }

  async generateToken(user: User) {
    const payload: IJWT = { id: user.id, email: user.email, isAdmin: user.isAdmin };
    return { token: this.jwtService.sign(payload) };
  }
}
