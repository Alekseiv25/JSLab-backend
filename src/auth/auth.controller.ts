import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import {
  ICheckUserEmailResponse,
  IRefreshResponseJWT,
  IRegistrationResponseJWT,
} from 'src/types/responses/users';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IRefreshResponseJWT> {
    const refreshToken: string = req.cookies.refreshToken;

    const response: IRefreshResponseJWT = await this.authService.refresh(refreshToken);
    if ('refreshToken' in response) {
      res.cookie('refreshToken', response.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
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

    if ('refreshToken' in response) {
      res.cookie('refreshToken', response.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    }

    return response;
  }
}
