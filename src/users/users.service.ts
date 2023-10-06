import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { Business } from 'src/businesses/businesses.model';
import { Station } from 'src/stations/stations.model';
import {
  makeDeleteMessage,
  makeNotFoundMessage,
  makeUniquenessResponseMessage,
} from 'src/utils/generators/messageGenerators';
import {
  IBasicUserResponse,
  ICheckUserEmailResponse,
  IDeleteUserResponse,
  IGetAllUsersResponse,
} from 'src/types/responses/users';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async getAllUsers(): Promise<IGetAllUsersResponse> {
    const users: User[] = await this.userRepository.findAll({
      include: [{ model: Business, include: [Station] }],
    });

    if (users.length === 0) {
      throw new HttpException(makeNotFoundMessage('Users'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllUsersResponse = { status: HttpStatus.OK, data: users };
    return response;
  }

  async getUserByID(id: number): Promise<IBasicUserResponse> {
    const user: User = await this.userRepository.findByPk(id, {
      include: [{ model: Business, include: [Station] }],
    });

    if (!user) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    const response: IBasicUserResponse = { status: HttpStatus.OK, data: user };
    return response;
  }

  async createUser(dto: CreateUserDto) {
    const newUser: User = await this.userRepository.create(dto);
    return newUser;
  }

  async updateUserByID(id: number, updatedUserDto: CreateUserDto): Promise<IBasicUserResponse> {
    const user: User = await this.userRepository.findByPk(id);

    if (!user) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    const updatedUser: User = await user.update(updatedUserDto);
    const response: IBasicUserResponse = { status: HttpStatus.OK, data: updatedUser };
    return response;
  }

  async deleteUserByID(id: number): Promise<IDeleteUserResponse> {
    const user: User = await this.userRepository.findByPk(id);

    if (!user) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    await user.destroy();
    const response: IDeleteUserResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('User'),
      data: user,
    };
    return response;
  }

  async checkUniquenessOfEmail(email: string): Promise<ICheckUserEmailResponse> {
    const userWithThisEmail: User | undefined = await this.findUserByEmail(email);

    if (userWithThisEmail) {
      throw new HttpException(makeUniquenessResponseMessage('Email', false), HttpStatus.CONFLICT);
    }

    const response: ICheckUserEmailResponse = {
      status: HttpStatus.OK,
      message: makeUniquenessResponseMessage('Email', true),
    };
    return response;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const user: User = await this.userRepository.findOne({ where: { email } });
    return user;
  }
}
