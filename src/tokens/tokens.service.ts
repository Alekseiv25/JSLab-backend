import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { makeNotFoundMessage } from '../utils/generators/messageGenerators';
import { UsersParams } from '../users_params/users_params.model';
import { ITokensCreationResponse } from '../auth/auth.service';
import { UserStatusTypes } from '../types/tableColumns';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { Token } from './tokens.model';
import * as jwt from 'jsonwebtoken';
import { UsersParamsService } from '../users_params/users_params.service';

const ACCESS_TOKEN_EXPIRES_IN = '5min';
const REFRESH_TOKEN_EXPIRES_IN = '1d';

export interface IAccessToken {
  id: number;
  email: string;
  status: UserStatusTypes;
}

export interface IRefreshToken {
  id: number;
}

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token) private tokenRepository: typeof Token,
    private usersParamsService: UsersParamsService,
  ) {}

  async generateToken(user: User, userParams: UsersParams): Promise<ITokensCreationResponse> {
    const accessTokenPayload: IAccessToken = {
      id: user.id,
      status: userParams.status,
      email: user.email,
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

  async removeRefreshToken(refreshToken: string): Promise<number> {
    try {
      const tokenInDB: Token = await this.findTokenInDB(refreshToken);
      const removedTokenID: number = await this.tokenRepository.destroy({
        where: { id: tokenInDB.id },
      });
      return removedTokenID;
    } catch (e) {
      throw new HttpException(makeNotFoundMessage('Token'), HttpStatus.NOT_FOUND);
    }
  }

  async findTokenInDB(refreshToken: string): Promise<Token> {
    const tokenInDB: Token = await this.tokenRepository.findOne({
      where: { refreshToken: refreshToken },
    });
    return tokenInDB;
  }

  async validateAccessToken(accessToken: string): Promise<IAccessToken | null> {
    try {
      const userDataFromToken: IAccessToken = jwt.verify(
        accessToken,
        process.env.JWT_PRIVATE_KEY,
      ) as IAccessToken;

      const userStatus: UserStatusTypes = await this.usersParamsService.getUserStatus(
        userDataFromToken.id,
      );

      return { ...userDataFromToken, status: userStatus };
    } catch (e) {
      return null;
    }
  }

  async validateRefreshToken(refreshToken: string): Promise<IRefreshToken | null> {
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
