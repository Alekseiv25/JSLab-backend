import { IBasicUserResponse, IUserParamsUpdateResponse } from 'src/types/responses/users';
import { CreateUserParamsDto } from 'src/users_params/dto/create-users_params.dto';
import { IUserAssignUpdateRequest } from 'src/types/requests/users';
import { CreateUserDto } from './dto/create-user.dto';
import { IBasicResponse } from 'src/types/responses';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import {
  IFiltersDataForAdminTableResponse,
  IUserDataForAdminTableResponse,
} from 'src/types/responses/users/admin_table';
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

  @Get('')
  @UseGuards(AuthGuard)
  getUserByID(@Query('userId') userId: string): Promise<IBasicUserResponse> {
    return this.userService.getUserByID(Number(userId));
  }

  @Get('table')
  @UseGuards(AuthGuard)
  getUsersDataForAdminTable(
    @Query('requesterId') requesterId: number,
    @Query('page') page?: number,
    @Query('itemsPerPage') itemsPerPage?: number,
    @Query('userName') userName?: string,
    @Query('stationName') stationName?: string,
    @Query('stationLocation') stationLocation?: string,
    @Query('userStatus') userStatus?: string,
  ): Promise<IUserDataForAdminTableResponse> {
    return this.userService.getUsersDataForAdminTable(
      requesterId,
      page,
      itemsPerPage,
      userName,
      stationName,
      stationLocation,
      userStatus,
    );
  }

  @Get('table/filters')
  @UseGuards(AuthGuard)
  getDataForFiltersInAdminTable(
    @Query('requesterId') requesterId: string,
  ): Promise<IFiltersDataForAdminTableResponse> {
    return this.userService.getDataForFiltersInAdminTable(Number(requesterId));
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
