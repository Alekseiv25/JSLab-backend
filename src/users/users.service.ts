import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { Business } from 'src/businesses/businesses.model';
import { Station } from 'src/stations/stations.model';
import makeUniquenessResponseMessage from 'src/utils/messageGenerator';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async getAllUsers() {
    const users = await this.userRepository.findAll({
      include: [{ model: Business, include: [Station] }],
    });
    return users;
  }

  async getUserByID(id: string) {
    const user = await this.userRepository.findByPk(id, {
      include: [{ model: Business, include: [Station] }],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const newUser: User = await this.userRepository.create(dto);
    return newUser;
  }

  async updateUserByID(id: number, updatedUserDto: CreateUserDto) {
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

  async checkUniquenessOfEmail(email: string) {
    const userWithThisEmail = await this.userRepository.findOne({ where: { email } });
    if (userWithThisEmail) {
      return { status: 409, message: makeUniquenessResponseMessage('Email', false) };
    } else {
      return { status: 200, message: makeUniquenessResponseMessage('Email', true) };
    }
  }
}
