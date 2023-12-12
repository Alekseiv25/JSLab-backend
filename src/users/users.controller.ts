import { CreateUserParamsDto } from 'src/users_params/dto/create-users_params.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  IBasicUserResponse,
  ICheckUserEmailResponse,
  IDeleteUserResponse,
  IGetAllUsersResponse,
  IUserInformationForAdminResponse,
  IUserParamsUpdateResponse,
  IValidateUserPasswordResponse,
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

  @Get()
  getAll(): Promise<IGetAllUsersResponse> {
    return this.userService.getAllUsers();
  }

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
  getUserByID(@Param('id') id: number): Promise<IBasicUserResponse> {
    return this.userService.getUserByID(id);
  }

  @Post('email-uniqueness')
  @HttpCode(200)
  async checkUniquenessOfUserEmail(@Body('email') email: string): Promise<ICheckUserEmailResponse> {
    return this.userService.checkUniquenessOfEmail(email);
  }

  @Post('password-validation')
  @HttpCode(200)
  async validatePassword(
    @Body('userID') userID: number,
    @Body('password') password: string,
  ): Promise<IValidateUserPasswordResponse> {
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

  @Put('tutorial-status/:id')
  @UseGuards(AuthGuard)
  updateUserParams(
    @Param('id') id: number,
    @Body() updatedUserParams: CreateUserParamsDto,
  ): Promise<IUserParamsUpdateResponse> {
    return this.userService.updateUserParams(id, updatedUserParams);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUserByID(@Param('id') id: number): Promise<IDeleteUserResponse> {
    return this.userService.deleteUserByID(id);
  }
}
