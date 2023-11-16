import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CookieOptions, Request, Response } from 'express';
import { ILoginUserData } from 'src/types/requests/users';
import {
  ICheckUserEmailResponse,
  ILoginResponse,
  ILogoutResponse,
  IRefreshResponseJWT,
  IRegistrationResponseJWT,
} from 'src/types/responses/users';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private createRefreshTokenOptions(): CookieOptions {
    const options: CookieOptions = {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    return options;
  }

  @Get('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IRefreshResponseJWT> {
    const refreshToken: string = req.cookies.refreshToken;
    const response: IRefreshResponseJWT = await this.authService.refresh(refreshToken);

    if ('refreshToken' in response.data) {
      res.cookie('refreshToken', response.data.refreshToken, this.createRefreshTokenOptions());
    }

    return response;
  }

  @Post('/registration')
  async registration(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IRegistrationResponseJWT | ICheckUserEmailResponse> {
    const response: IRegistrationResponseJWT | ICheckUserEmailResponse =
      await this.authService.registration(userDto);

    if ('data' in response && 'refreshToken' in response.data) {
      res.cookie('refreshToken', response.data.refreshToken, this.createRefreshTokenOptions());
    }

    return response;
  }

  @Post('/login')
  async login(
    @Body() userData: ILoginUserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ILoginResponse> {
    const response: ILoginResponse = await this.authService.login(userData);

    if ('refreshToken' in response.data) {
      res.cookie('refreshToken', response.data.refreshToken, this.createRefreshTokenOptions());
    }

    return response;
  }

  @Get('/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ILogoutResponse> {
    const refreshToken: string = req.cookies.refreshToken;
    const response: ILogoutResponse = await this.authService.logout(refreshToken);

    if (response.status === HttpStatus.OK) {
      res.clearCookie('refreshToken');
    }

    return response;
  }
}
