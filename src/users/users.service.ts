import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserParamsDto } from 'src/users_params/dto/create-users_params.dto';
import { UsersParamsService } from 'src/users_params/users_params.service';
import { IUserAssignUpdateRequest } from 'src/types/requests/users';
import { UsersParams } from 'src/users_params/users_params.model';
import { UserStationRoleTypes } from 'src/types/tableColumns';
import { User, UserStationRole } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { Station } from 'src/stations/stations.model';
import { IBasicResponse } from 'src/types/responses';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import {
  makeAlreadyActivatedMessage,
  makeAvailableMessage,
  makeConflictMessage,
  makeDeleteMessage,
  makeNotFoundMessage,
  makeNotValidPasswordMessage,
  makeSuccessUpdatingMessage,
  makeValidPasswordMessage,
} from 'src/utils/generators/messageGenerators';
import {
  IBasicUserResponse,
  IDeleteUserResponse,
  IGetAllUsersResponse,
  IInvitedUserDataResponse,
  IUserAssignedInformationForAdmin,
  IUserGeneralInformationForAdmin,
  IUserInformationForAdmin,
  IUserInformationForAdminResponse,
  IUserParamsInformationForAdmin,
  IUserParamsUpdateResponse,
} from 'src/types/responses/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private userParamsService: UsersParamsService,
  ) {}

  async getAllUsers(): Promise<IGetAllUsersResponse> {
    const users: User[] | [] = await this.userRepository.findAll({
      include: [
        {
          model: UsersParams,
          as: 'parameters',
        },
        {
          model: Station,
          through: {
            attributes: ['role'],
          },
        },
      ],
    });

    if (users.length === 0) {
      throw new HttpException(makeNotFoundMessage('Users'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllUsersResponse = { status: HttpStatus.OK, data: users };
    return response;
  }

  async getUserByID(id: number): Promise<IBasicUserResponse> {
    const userData: User = await this.findUserByID(id);
    const response: IBasicUserResponse = { status: HttpStatus.OK, data: userData };
    return response;
  }

  async getUsersInfoForAdminTable(requesterId: number): Promise<IUserInformationForAdminResponse> {
    const requester: User = await this.findUserByID(requesterId);
    const usersRelatedToRequesterBusiness: User[] = await this.findAllUsersRelatedToBusiness(
      requester.id,
    );

    const transformedUsersInfoPromises: Promise<IUserInformationForAdmin>[] =
      usersRelatedToRequesterBusiness
        .filter((user) => user.id !== requesterId)
        .map((user) => this.transformUsersDataForAdmin(user));
    const usersInfo: IUserInformationForAdmin[] = await Promise.all(transformedUsersInfoPromises);

    const response: IUserInformationForAdminResponse = { status: HttpStatus.OK, data: usersInfo };
    return response;
  }

  async createUser(dto: CreateUserDto) {
    const newUser: User = await this.userRepository.create(dto);
    return newUser;
  }

  async updateUserByID(
    id: number,
    updatedData: Partial<CreateUserDto>,
  ): Promise<IBasicUserResponse> {
    const user: User = await this.findUserByID(id);

    let updatedUser: User | null = null;
    if (updatedData.hasOwnProperty('password')) {
      const hashPassword: string = await bcrypt.hash(updatedData.password, 10);
      updatedUser = await user.update({ ...updatedData, password: hashPassword });
    } else {
      updatedUser = await user.update({ ...updatedData });
    }

    const response: IBasicUserResponse = { status: HttpStatus.OK, data: updatedUser };
    return response;
  }

  async updateUserParams(
    id: number,
    newParams: CreateUserParamsDto,
  ): Promise<IUserParamsUpdateResponse> {
    const updatedParams: UsersParams = await this.userParamsService.updateUserParams(id, newParams);
    const response: IUserParamsUpdateResponse = {
      status: HttpStatus.OK,
      updatedUserParams: updatedParams,
    };
    return response;
  }

  async updateUserAssign(
    id: number,
    assignData: IUserAssignUpdateRequest,
  ): Promise<IBasicResponse> {
    const user: User = await this.findUserByID(id);

    await this.updateUserStationAssigns(user, 'Admin', assignData.asAdmin || []);
    await this.updateUserStationAssigns(user, 'Member', assignData.asMember || []);

    const response: IBasicResponse = {
      status: HttpStatus.OK,
      message: makeSuccessUpdatingMessage(),
    };
    return response;
  }

  async deleteUserByID(id: number): Promise<IDeleteUserResponse> {
    const user: User = await this.findUserByID(id);
    await user.destroy();

    const response: IDeleteUserResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('User'),
      data: user,
    };
    return response;
  }

  async checkUniquenessOfEmail(email: string): Promise<IBasicResponse> {
    const isEmailUnique: boolean = await this.checkIsEmailUnique(email);

    if (!isEmailUnique) {
      throw new HttpException(makeConflictMessage('Email'), HttpStatus.CONFLICT);
    }

    const response: IBasicResponse = {
      status: HttpStatus.OK,
      message: makeAvailableMessage('Email'),
    };
    return response;
  }

  async getUserInformationByInviteLink(inviteLink: string): Promise<IInvitedUserDataResponse> {
    const userParams: UsersParams =
      await this.userParamsService.getUserParamsByInviteLink(inviteLink);

    if (userParams.status !== 'Invited') {
      throw new HttpException(makeAlreadyActivatedMessage(), HttpStatus.BAD_REQUEST);
    }

    const user: User = await this.findUserByID(userParams.userId);
    const invitedUserInformation: Pick<User, 'id' | 'firstName' | 'email'> = {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
    };

    const response: IInvitedUserDataResponse = {
      status: HttpStatus.OK,
      invitedUserData: invitedUserInformation,
    };

    return response;
  }

  async checkIsEmailUnique(emailToCheck: string): Promise<boolean> {
    const user: User | null = await this.findUserByEmail(emailToCheck);

    if (user) {
      return false;
    }

    return true;
  }

  async validatePassword(id: number, password: string): Promise<IBasicResponse> {
    const user: User = await this.findUserByID(id);

    const isPasswordsEquals: boolean = await bcrypt.compare(password, user.password);
    if (!isPasswordsEquals) {
      throw new HttpException(makeNotValidPasswordMessage(), HttpStatus.BAD_REQUEST);
    }

    const response: IBasicResponse = { status: HttpStatus.OK, message: makeValidPasswordMessage() };
    return response;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async findUserByID(userID: number): Promise<User> {
    const user: User | null = await this.userRepository.findByPk(userID);

    if (!user) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    return user;
  }

  private async findAllUsersRelatedToBusiness(businessID: number): Promise<User[]> {
    const usersRelatedToRequesterBusiness: User[] = await this.userRepository.findAll({
      where: { businessId: businessID },
    });

    if (!usersRelatedToRequesterBusiness || usersRelatedToRequesterBusiness.length === 0) {
      throw new HttpException(makeNotFoundMessage('Users'), HttpStatus.NOT_FOUND);
    }

    return usersRelatedToRequesterBusiness;
  }

  private async transformUsersDataForAdmin(user: User): Promise<IUserInformationForAdmin> {
    const userParams: UsersParams = await this.userParamsService.getUserParams(user.id);
    const userStations: UserStationRole[] = await UserStationRole.findAll({
      where: { userId: user.id },
      include: [{ model: Station }],
    });

    const generalInformationAboutUser: IUserGeneralInformationForAdmin = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName || null,
      email: user.email,
    };

    const paramsInformationAboutUser: IUserParamsInformationForAdmin = {
      lastActiveTimestamp: userParams.lastActivityDate,
      status: userParams.status,
      statusChangeDate: userParams.statusChangeDate,
    };

    const assignedInfo: IUserAssignedInformationForAdmin[] = userStations.map((userStation) => ({
      stationId: userStation.station.id,
      stationName: userStation.station.name,
      stationMerchantId: userStation.station.merchantId,
      stationStoreId: userStation.station.storeId,
      userRole: userStation.role,
    }));

    return {
      general: generalInformationAboutUser,
      params: paramsInformationAboutUser,
      assigned: assignedInfo,
    };
  }

  private async updateUserStationAssigns(
    user: User,
    role: UserStationRoleTypes,
    stationIds: number[],
  ) {
    const userId: number = user.id;

    const existingUserStationRoles: UserStationRole[] = await UserStationRole.findAll({
      where: { userId, role },
    });

    const stationIdsToRemove: number[] = existingUserStationRoles
      .filter((userStationRole) => !stationIds.includes(userStationRole.stationId))
      .map((userStationRole) => userStationRole.stationId);

    const stationIdsToAdd: number[] = stationIds.filter(
      (stationId) =>
        !existingUserStationRoles.some(
          (userStationRole) => userStationRole.stationId === stationId,
        ),
    );

    await UserStationRole.destroy({
      where: { userId, role, stationId: stationIdsToRemove },
    });

    for (const stationId of stationIdsToAdd) {
      const station: Station | null = await Station.findByPk(stationId);
      if (station) {
        await UserStationRole.create({
          userId,
          stationId: station.id,
          role: role,
        });
      }
    }

    await Promise.all(
      existingUserStationRoles.map(async (userStationRole) => {
        if (!stationIdsToRemove.includes(userStationRole.stationId)) {
          userStationRole.role = role;
          await userStationRole.save();
        }
      }),
    );
  }
}
