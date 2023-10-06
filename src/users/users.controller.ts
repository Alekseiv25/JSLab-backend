import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  IBasicUserResponse,
  ICheckUserEmailResponse,
  IDeleteUserResponse,
  IGetAllUsersResponse,
} from 'src/types/responses/users';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAll(): Promise<IGetAllUsersResponse | HttpException> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserByID(@Param('id') id: number): Promise<IBasicUserResponse | HttpException> {
    return this.userService.getUserByID(id);
  }

  @Post('email-uniqueness')
  @HttpCode(200)
  async checkUniquenessOfUserEmail(
    @Body('email') email: string,
  ): Promise<ICheckUserEmailResponse | HttpException> {
    return this.userService.checkUniquenessOfEmail(email);
  }

  @Put(':id')
  updateUserByID(
    @Param('id') id: number,
    @Body() updatedData: CreateUserDto,
  ): Promise<IBasicUserResponse | HttpException> {
    return this.userService.updateUserByID(id, updatedData);
  }

  @Delete(':id')
  deleteUserByID(@Param('id') id: number): Promise<IDeleteUserResponse | HttpException> {
    return this.userService.deleteUserByID(id);
  }
}
