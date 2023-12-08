import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res } from '@nestjs/common';
import { ILoginUserData, IUserInvitationRequest } from 'src/types/requests/users';
import { ActivateUserDto, CreateNewUserDto } from './dto/create-user.dto';
import { CookieOptions, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { IBasicResponse } from 'src/types/responses';
import { AuthService } from './auth.service';
import {
  ICheckUserEmailResponse,
  IInvitedUserDataResponse,
  ILoginResponse,
  ILogoutResponse,
  IRefreshResponseJWT,
  IRegistrationResponseJWT,
} from 'src/types/responses/users';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  private createRefreshTokenOptions(): CookieOptions {
    const options: CookieOptions = {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    return options;
  }

  @Get('/invite')
  async getInvitedUserInformation(
    @Query('inviteLink') inviteLink: string,
  ): Promise<IInvitedUserDataResponse> {
    return await this.userService.getUserInformationByInviteLink(inviteLink);
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
    @Body() userDto: CreateNewUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IRegistrationResponseJWT | ICheckUserEmailResponse> {
    const response: IRegistrationResponseJWT | ICheckUserEmailResponse =
      await this.authService.registration(userDto);

    if ('data' in response && 'refreshToken' in response.data) {
      res.cookie('refreshToken', response.data.refreshToken, this.createRefreshTokenOptions());
    }

    return response;
  }

  @Post('/activate-invite')
  async activateInvitedUserAccount(
    @Body() userDto: ActivateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: IRegistrationResponseJWT =
      await this.authService.activateInvitedUserAccount(userDto);

    if ('data' in response && 'refreshToken' in response.data) {
      res.cookie('refreshToken', response.data.refreshToken, this.createRefreshTokenOptions());
    }

    return response;
  }

  @Post('/invite')
  async invite(@Body() invitedUserData: IUserInvitationRequest): Promise<IBasicResponse> {
    const response: IBasicResponse = await this.authService.invite(invitedUserData);
    return response;
  }

  @Post('/login')
  async login(
    @Body() userData: ILoginUserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ILoginResponse> {
    const response: ILoginResponse = await this.authService.login(userData);

    if ('data' in response && 'refreshToken' in response.data.tokens) {
      res.cookie(
        'refreshToken',
        response.data.tokens.refreshToken,
        this.createRefreshTokenOptions(),
      );
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
