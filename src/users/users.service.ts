import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { Business } from 'src/businesses/businesses.model';
import { Station } from 'src/stations/stations.model';
import { makeDeleteMessage } from 'src/utils/generators/messageGenerators';
import { IBasicResponse } from 'src/types/responses';
import {
  IBasicUserResponse,
  ICheckUserEmailResponse,
  IDeleteUserResponse,
  IGetAllUsersResponse,
} from 'src/types/responses/users';
import {
  generateAvailableResponse,
  generateConflictResponse,
  generateNotFoundResponse,
} from 'src/utils/generators/responseObjectGenerators';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async getAllUsers(): Promise<IGetAllUsersResponse | IBasicResponse> {
    const users: User[] | [] = await this.userRepository.findAll({
      include: [{ model: Business, include: [Station] }],
    });

    if (users.length === 0) {
      const response: IBasicResponse = generateNotFoundResponse('Users');
      return response;
    }

    const response: IGetAllUsersResponse = { statusCode: HttpStatus.OK, data: users };
    return response;
  }

  async getUserByID(id: number): Promise<IBasicUserResponse | IBasicResponse> {
    const user: User | null = await this.userRepository.findByPk(id, {
      include: [{ model: Business, include: [Station] }],
    });

    if (!user) {
      const response: IBasicResponse = generateNotFoundResponse('User');
      return response;
    }

    const response: IBasicUserResponse = { statusCode: HttpStatus.OK, data: user };
    return response;
  }

  async createUser(dto: CreateUserDto) {
    const newUser: User = await this.userRepository.create(dto);
    return newUser;
  }

  async updateUserByID(
    id: number,
    updatedUserDto: CreateUserDto,
  ): Promise<IBasicUserResponse | IBasicResponse> {
    const user: User | null = await this.userRepository.findByPk(id);

    if (!user) {
      const response: IBasicResponse = generateNotFoundResponse('User');
      return response;
    }

    const updatedUser: User = await user.update(updatedUserDto);
    const response: IBasicUserResponse = { statusCode: HttpStatus.OK, data: updatedUser };
    return response;
  }

  async deleteUserByID(id: number): Promise<IDeleteUserResponse | IBasicResponse> {
    const user: User | null = await this.userRepository.findByPk(id);

    if (!user) {
      const response: IBasicResponse = generateNotFoundResponse('User');
      return response;
    }

    await user.destroy();
    const response: IDeleteUserResponse = {
      statusCode: HttpStatus.OK,
      message: makeDeleteMessage('User'),
      data: user,
    };
    return response;
  }

  async checkUniquenessOfEmail(email: string): Promise<ICheckUserEmailResponse | IBasicResponse> {
    const userWithThisEmail: User | null = await this.findUserByEmail(email);

    if (userWithThisEmail) {
      const response: IBasicResponse = generateConflictResponse('User');
      return response;
    }

    const response: IBasicResponse = generateAvailableResponse('User');
    return response;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findOne({ where: { email } });
    return user;
  }
}
