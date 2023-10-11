import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IResponseJWT } from 'src/types/responses/users';
import { User } from 'src/users/users.model';

interface IJWT {
  id: number;
  email: string;
  isAdmin: boolean;
}

@Injectable()
export class TokensService {
  constructor(private jwtService: JwtService) {}

  async generateToken(user: User): Promise<IResponseJWT> {
    const payload: IJWT = { id: user.id, email: user.email, isAdmin: user.isAdmin };
    return { token: this.jwtService.sign(payload) };
  }
}
