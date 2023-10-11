import { Injectable } from '@nestjs/common';
import { ITokensCreationResponse } from 'src/auth/auth.service';
import { User } from 'src/users/users.model';
import * as jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRES_IN = '30min';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

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
  async generateToken(user: User): Promise<ITokensCreationResponse> {
    const accessTokenPayload: IAccessToken = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    const refreshTokenPayload: IRefreshToken = { id: user.id };

    const accessToken: string = jwt.sign(accessTokenPayload, process.env.JWT_PRIVATE_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken: string = jwt.sign(
      refreshTokenPayload,
      process.env.JWT_REFRESH_PRIVATE_KEY,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    return { accessToken, refreshToken };
  }
}
