import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserByID(@Param('id') id: string) {
    return this.userService.getUserByID(id);
  }

  @Post('email-uniqueness')
  @HttpCode(200)
  async checkUniquenessOfUserEmail(@Body('email') email: string) {
    return await this.userService.checkUniquenessOfEmail(email);
  }

  @Put(':id')
  updateUserByID(@Param('id') id: number, @Body() updatedUserDto: CreateUserDto) {
    return this.userService.updateUserByID(id, updatedUserDto);
  }

  @Delete(':id')
  deleteUserByID(@Param('id') id: string) {
    return this.userService.deleteUserByID(id);
  }
}
