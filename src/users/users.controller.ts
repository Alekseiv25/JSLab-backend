import { CreateUserParamsDto } from 'src/users_params/dto/create-users_params.dto';
import { IUserAssignUpdateRequest } from 'src/types/requests/users';
import { CreateUserDto } from './dto/create-user.dto';
import { IBasicResponse } from 'src/types/responses';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import {
  IBasicUserResponse,
  IUserInformationForAdminResponse,
  IUserParamsUpdateResponse,
} from 'src/types/responses/users';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('admin/users-information')
  @UseGuards(AuthGuard)
  getUsersInformationForAdmin(
    @Query('requesterId') requesterId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('name') name?: string,
    @Query('stationName') stationName?: string,
    @Query('status') status?: string,
  ): Promise<IUserInformationForAdminResponse> {
    return this.userService.getUsersInformationForAdmin(
      Number(requesterId),
      limit,
      offset,
      name,
      stationName,
      status,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getUserByID(@Query('userId') userId: string): Promise<IBasicUserResponse> {
    return this.userService.getUserByID(Number(userId));
  }

  @Get('admin/users-information')
  @UseGuards(AuthGuard)
  getUsersInfoForAdminTable(
    @Query('requesterId') requesterId: string,
  ): Promise<IUserInformationForAdminResponse> {
    return this.userService.getUsersInfoForAdminTable(Number(requesterId));
  }

  @Get('invite')
  @UseGuards(AuthGuard)
  reinviteUser(
    @Query('invitedUserId') invitedUserId: string,
    @Query('inviterUserId') inviterUserId: string,
  ): Promise<IBasicResponse> {
    return this.userService.reinviteUser(Number(invitedUserId), Number(inviterUserId));
  }

  @Post('email-uniqueness')
  @HttpCode(200)
  async checkEmailUnique(@Body('email') email: string): Promise<IBasicResponse> {
    return this.userService.checkUniquenessOfEmail(email);
  }

  @Post('password')
  async validatePassword(
    @Body('userID') userID: number,
    @Body('password') password: string,
  ): Promise<IBasicResponse> {
    return this.userService.validatePassword(userID, password);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateUserByID(
    @Param('id') id: number,
    @Body() updatedData: CreateUserDto,
  ): Promise<IBasicUserResponse> {
    return this.userService.updateUserByID(id, updatedData);
  }

  @Put('parameters/:id')
  @UseGuards(AuthGuard)
  updateUserParams(
    @Param('id') id: number,
    @Body() updatedUserParams: CreateUserParamsDto,
  ): Promise<IUserParamsUpdateResponse> {
    return this.userService.updateUserParams(id, updatedUserParams);
  }

  @Put('assign/:id')
  @UseGuards(AuthGuard)
  updateUserAssign(
    @Param('id') userID: number,
    @Body() assignData: IUserAssignUpdateRequest,
  ): Promise<IBasicResponse> {
    return this.userService.updateUserAssign(userID, assignData);
  }

  @Delete('invite/:id')
  @UseGuards(AuthGuard)
  cancelUserInvite(@Param('id') id: number): Promise<IBasicResponse> {
    return this.userService.cancelUserInvite(Number(id));
  }
}
