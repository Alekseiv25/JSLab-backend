import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  IBasicUserResponse,
  ICheckUserEmailResponse,
  IDeleteUserResponse,
  IGetAllUsersResponse,
} from 'src/types/responses/users';
import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAll(): Promise<IGetAllUsersResponse> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserByID(@Param('id') id: number): Promise<IBasicUserResponse> {
    return this.userService.getUserByID(id);
  }

  @Post('email-uniqueness')
  @HttpCode(200)
  async checkUniquenessOfUserEmail(@Body('email') email: string): Promise<ICheckUserEmailResponse> {
    return this.userService.checkUniquenessOfEmail(email);
  }

  @Put(':id')
  updateUserByID(
    @Param('id') id: number,
    @Body() updatedData: CreateUserDto,
  ): Promise<IBasicUserResponse> {
    return this.userService.updateUserByID(id, updatedData);
  }

  @Delete(':id')
  deleteUserByID(@Param('id') id: number): Promise<IDeleteUserResponse> {
    return this.userService.deleteUserByID(id);
  }
}
