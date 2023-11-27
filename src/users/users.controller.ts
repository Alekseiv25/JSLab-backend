import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  IBasicUserResponse,
  ICheckUserEmailResponse,
  IDeleteUserResponse,
  IGetAllUsersResponse,
  IUserInformationForAdminResponse,
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
  getUsersInformationForAdmin(
    @Query('requesterId') requesterId: string,
  ): Promise<IUserInformationForAdminResponse> {
    return this.userService.getUsersInformationForAdmin(Number(requesterId));
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

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUserByID(@Param('id') id: number): Promise<IDeleteUserResponse> {
    return this.userService.deleteUserByID(id);
  }
}
