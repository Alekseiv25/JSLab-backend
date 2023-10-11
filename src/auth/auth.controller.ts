import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ICheckUserEmailResponse, IRegistrationResponseJWT } from 'src/types/responses/users';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
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
