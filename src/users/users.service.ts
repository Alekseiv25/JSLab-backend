import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { Business } from 'src/businesses/businesses.model';
import { Station } from 'src/stations/stations.model';
import * as bcrypt from 'bcrypt';
import {
  makeAvailableMessage,
  makeConflictMessage,
  makeDeleteMessage,
  makeNotFoundMessage,
  makeNotValidPasswordMessage,
  makeValidPasswordMessage,
} from 'src/utils/generators/messageGenerators';
import {
  IBasicUserResponse,
  ICheckUserEmailResponse,
  IDeleteUserResponse,
  IGetAllUsersResponse,
  IUserParamsUpdateResponse,
  IValidateUserPasswordResponse,
} from 'src/types/responses/users';
import { UsersParams } from 'src/users_params/users_params.model';
import { UsersParamsService } from 'src/users_params/users_params.service';
import { CreateUserParamsDto } from 'src/users_params/dto/create-users_params.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private userParamsService: UsersParamsService,
  ) {}

  async getAllUsers(): Promise<IGetAllUsersResponse> {
    const users: User[] | [] = await this.userRepository.findAll({
      include: [{ model: UsersParams }, { model: Business, include: [Station] }],
    });

    if (users.length === 0) {
      throw new HttpException(makeNotFoundMessage('Users'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllUsersResponse = { status: HttpStatus.OK, data: users };
    return response;
  }

  // async getUsersInformationForAdmin(
  //   requesterId: number,
  // ): Promise<IUserInformationForAdminResponse> {
  //   const users = await this.userRepository.findAll({ include: Station });

  //   if (!users) {
  //     throw new HttpException(makeNotFoundMessage('Users'), HttpStatus.NOT_FOUND);
  //   }

  //   const transformedUsers: IUserInformationForAdmin[] = [];

  //   for (const user of users) {
  //     if (user.id !== requesterId) {
  //       const transformedUser: IUserInformationForAdmin =
  //         await this.transformUsersDataForAdmin(user);
  //       transformedUsers.push(transformedUser);
  //     }
  //   }

  //   const response: IUserInformationForAdminResponse = {
  //     status: HttpStatus.OK,
  //     data: transformedUsers,
  //   };

  //   return response;
  // }

  async getUserByID(id: number): Promise<IBasicUserResponse> {
    const user: User | null = await this.userRepository.findByPk(id, {
      include: [{ model: Business, include: [Station] }],
    });

    if (!user) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    const response: IBasicUserResponse = { status: HttpStatus.OK, data: user };
    return response;
  }

  async getUserInformation(id: number): Promise<User | null> {
    const user: User | null = await this.userRepository.findByPk(id);
    return user;
  }

  async createUser(dto: CreateUserDto) {
    const newUser: User = await this.userRepository.create(dto);
    return newUser;
  }

  async updateUserByID(id: number, updatedUserDto: CreateUserDto): Promise<IBasicUserResponse> {
    const user: User | null = await this.userRepository.findByPk(id);

    if (!user) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    let updatedUser: User | null = null;

    if (updatedUserDto.hasOwnProperty('password')) {
      const hashPassword: string = await this.hashUserPassword(updatedUserDto.password);
      updatedUser = await user.update({ ...updatedUserDto, password: hashPassword });
    } else {
      updatedUser = await user.update({ ...updatedUserDto });
    }

    const response: IBasicUserResponse = { status: HttpStatus.OK, data: updatedUser };
    return response;
  }

  async updateUserParams(
    id: number,
    updatedUserParams: CreateUserParamsDto,
  ): Promise<IUserParamsUpdateResponse> {
    const changeStatusResponse: IUserParamsUpdateResponse =
      await this.userParamsService.updateUserParams(id, updatedUserParams);
    return changeStatusResponse;
  }

  async deleteUserByID(id: number): Promise<IDeleteUserResponse> {
    const user: User | null = await this.userRepository.findByPk(id);

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
    const userWithThisEmail: User | null = await this.findUserByEmail(email);

    if (userWithThisEmail) {
      throw new HttpException(makeConflictMessage('Email'), HttpStatus.CONFLICT);
    }

    const response: ICheckUserEmailResponse = {
      status: HttpStatus.OK,
      message: makeAvailableMessage('Email'),
    };
    return response;
  }

  async validatePassword(
    userID: number,
    userPassword: string,
  ): Promise<IValidateUserPasswordResponse> {
    const user: User | null = await this.findUserByID(userID);

    if (!user) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    const isPasswordsEquals: boolean = await bcrypt.compare(userPassword, user.password);

    if (!isPasswordsEquals) {
      throw new HttpException(makeNotValidPasswordMessage(), HttpStatus.BAD_REQUEST);
    }

    const response: IValidateUserPasswordResponse = {
      status: HttpStatus.OK,
      message: makeValidPasswordMessage(),
    };
    return response;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async findUserByID(userID: number): Promise<User | null> {
    const user: User | null = await this.userRepository.findByPk(userID);
    return user;
  }

  private async hashUserPassword(password: string): Promise<string> {
    const hashPassword: string = await bcrypt.hash(password, 10);
    return hashPassword;
  }

  // private async transformUsersDataForAdmin(user: User): Promise<IUserInformationForAdmin> {
  //   const today = new Date().toISOString().split('T')[0];

  //   const generalInfo: IUserGeneralInformationForAdmin = {
  //     id: user.id,
  //     firstName: user.firstName,
  //     lastName: user.lastName || null,
  //     email: user.email,
  //   };

  //   const paramsInfo: IUserParamsInformationForAdmin = {
  //     lastActiveDate: today,
  //     lastActiveTime: '',
  //     permissionLevel: user.isAdmin ? 'Admin' : 'Member',
  //     status: user.status,
  //     statusChangeDate: today,
  //   };

  //   const assignedInfo: IUserAssignedInformationForAdmin[] = [];

  //   if (user.stations.length > 0) {
  //     for (const station of user.stations) {
  //       const assignedStation: IUserAssignedInformationForAdmin = {
  //         stationId: station.id,
  //         stationName: station.name,
  //         stationMerchantId: station.merchantId,
  //         stationStoreId: station.storeId,
  //       };

  //       assignedInfo.push(assignedStation);
  //     }
  //   }

  //   return {
  //     general: generalInfo,
  //     params: paramsInfo,
  //     assigned: assignedInfo,
  //   };
  // }
}
