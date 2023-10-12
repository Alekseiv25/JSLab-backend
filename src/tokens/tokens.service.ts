import { Injectable } from '@nestjs/common';
import { ITokensCreationResponse } from 'src/auth/auth.service';
import { User } from 'src/users/users.model';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './tokens.model';
import { JwtPayload } from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRES_IN = '30min';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export interface IAccessToken {
  id: number;
  email: string;
  isAdmin: boolean;
}

export interface IRefreshToken {
  id: number;
}

@Injectable()
export class TokensService {
  constructor(@InjectModel(Token) private tokenRepository: typeof Token) {}

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

  async saveToken(userId: number, refreshToken: string) {
    const tokenInDB = await this.tokenRepository.findOne({ where: { userId: userId } });

    if (tokenInDB) {
      tokenInDB.refreshToken = refreshToken;
      return tokenInDB.save();
    }

    const token = await this.tokenRepository.create({ userId: userId, refreshToken: refreshToken });

    return token;
  }

  async findTokenInDB(refreshToken: string): Promise<Token> {
    const tokenInDB: Token = await this.tokenRepository.findOne({
      where: { refreshToken: refreshToken },
    });
    return tokenInDB;
  }

  validateAccessToken(accessToken: string): string | JwtPayload | null {
    try {
      const userDataFromToken: string | JwtPayload = jwt.verify(
        accessToken,
        process.env.JWT_PRIVATE_KEY,
      );
      return userDataFromToken;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(refreshToken: string): IRefreshToken | null {
    try {
      const userDataFromToken: IRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_PRIVATE_KEY,
      ) as IRefreshToken;
      return userDataFromToken;
    } catch (e) {
      return null;
    }
  }
}
