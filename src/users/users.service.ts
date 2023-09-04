import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async getUserByID(id: string) {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async updateUserByID(id: string, updatedUserDto) {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await user.update(updatedUserDto);
    return user;
  }

  async deleteUserByID(id: string) {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await user.destroy();
    return { message: `User with ID ${id} has been deleted...` };
  }
}
