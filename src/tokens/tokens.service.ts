import { Injectable } from '@nestjs/common';
import { IResponseJWT } from 'src/types/responses/users';
import { User } from 'src/users/users.model';
import * as jwt from 'jsonwebtoken';

interface IAccessToken {
  id: number;
  email: string;
  isAdmin: boolean;
}

interface IRefreshToken {
  id: number;
}

@Injectable()
export class TokensService {
  async generateToken(user: User): Promise<IResponseJWT> {
    const accessTokenPayload: IAccessToken = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    const refreshTokenPayload: IRefreshToken = { id: user.id };

    const accessToken: string = jwt.sign(accessTokenPayload, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '1h',
    });
    const refreshToken: string = jwt.sign(
      refreshTokenPayload,
      process.env.JWT_REFRESH_PRIVATE_KEY,
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }
}
