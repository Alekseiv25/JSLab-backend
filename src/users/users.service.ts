import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DuplicateValueExeption, UniqueValueExeption } from '../Exceptions/exceptions';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Business } from 'src/businesses/businesses.model';
import { Station } from 'src/stations/stations.model';

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
    try {
      const response = await this.checkUniquenessOfEmail(dto.email);

      if (response instanceof DuplicateValueExeption) {
        return {
          response: `${response.message}`,
          status: response.getStatus(),
          options: undefined,
        };
      } else if (response instanceof UniqueValueExeption) {
        return await this.createUserWithHashedPassword(dto);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createUserWithHashedPassword(dto: CreateUserDto) {
    const saltRounds = 10;
    dto.password = await bcrypt.hash(dto.password, saltRounds);
    const user = await this.userRepository.create(dto);
    return user;
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
    return userWithThisEmail
      ? new DuplicateValueExeption('Email')
      : new UniqueValueExeption('Emial');
  }
}
