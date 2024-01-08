import { CreateUserParamsDto } from 'src/users_params/dto/create-users_params.dto';
import { IInviteDto, IUserAssignUpdateRequest } from 'src/types/requests/users';
import { UsersParamsService } from 'src/users_params/users_params.service';
import { FindOptions, IncludeOptions, Op, WhereOptions } from 'sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BusinessesService } from 'src/businesses/businesses.service';
import { UsersParams } from 'src/users_params/users_params.model';
import { UserStationRoleTypes } from 'src/types/tableColumns';
import { Business } from 'src/businesses/businesses.model';
import { User, UserStationRole } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { Station } from 'src/stations/stations.model';
import { IBasicResponse } from 'src/types/responses';
import { InjectModel } from '@nestjs/sequelize';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import {
  makeAlreadyActivatedMessage,
  makeNotValidPasswordMessage,
  makeSuccessInvitingMessage,
  makeSuccessUpdatingMessage,
  makeValidPasswordMessage,
  makeAvailableMessage,
  makeConflictMessage,
  makeNotFoundMessage,
  makeDeleteMessage,
} from 'src/utils/generators/messageGenerators';
import {
  IUserParamsUpdateResponse,
  IInvitedUserDataResponse,
  IBasicUserResponse,
} from 'src/types/responses/users';
import {
  generateHTMLForEmailToInviteUser,
  IUserInviteGeneratorArguments,
} from 'src/utils/generators/emailGenerators';
import {
  IFiltersDataForAdminTableResponse,
  IUserDataForAdminTableResponse,
  IFilterOptionAdvancedData,
  IFiltersDataForTable,
  IUserDataForTable,
  IAssignedToData,
  IGeneralData,
  IParamsData,
} from 'src/types/responses/users/admin_table';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private userParamsService: UsersParamsService,
    private businessService: BusinessesService,
  ) {}

  async getUsersDataForAdminTable(
    requesterId: number,
    page: number,
    itemsPerPage: number,
    userName: string,
    stationName: string,
    stationAddress: string,
    userStatus: string,
  ): Promise<IUserDataForAdminTableResponse> {
    const requester: User = await this.findUserByID(requesterId);

    const membersOfRequesterBusiness: User[] = await this.userRepository.findAll({
      where: { businessId: requester.businessId },
    });
    if (!membersOfRequesterBusiness || membersOfRequesterBusiness.length === 0) {
      throw new HttpException(makeNotFoundMessage('Users'), HttpStatus.NOT_FOUND);
    }

    const where: WhereOptions<User> = { businessId: requester.businessId };
    const includeOptions: IncludeOptions[] = [];

    if (userName) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${userName}%` } },
        { lastName: { [Op.iLike]: `%${userName}%` } },
      ];
    }

    if (stationName) {
      const stationNameList = stationName.split(',');
      includeOptions.push({
        model: Station,
        where: {
          name: {
            [Op.in]: stationNameList,
          },
        },
      });
    }

    if (stationAddress) {
      const stationAddresses: string[] = stationAddress.split('~');
      includeOptions.push({
        model: Station,
        where: {
          address: {
            [Op.in]: stationAddresses,
          },
        },
      });
    }

    if (userStatus) {
      const statusList = userStatus.split(',');
      includeOptions.push({
        model: UsersParams,
        where: {
          status: {
            [Op.in]: statusList,
          },
        },
      });
    }

    const options: FindOptions = {
      where: { ...where, id: { [Op.ne]: requesterId } },
      include: includeOptions,
      order: [['id', 'DESC']],
    };

    const { count, rows: filteredMembersOfRequesterBusiness } =
      await this.userRepository.findAndCountAll(options);
    if (!filteredMembersOfRequesterBusiness || filteredMembersOfRequesterBusiness.length === 0) {
      throw new HttpException(makeNotFoundMessage('Users'), HttpStatus.BAD_REQUEST);
    }

    const totalPages: number = Math.ceil(count / itemsPerPage);
    const calculatedPage: number = Math.max(1, Math.min(page, totalPages));
    const offset: number = (calculatedPage - 1) * itemsPerPage;

    options.limit = itemsPerPage;
    options.offset = offset;

    const usersDataForTable: Promise<IUserDataForTable>[] = filteredMembersOfRequesterBusiness
      .filter((user) => user.id !== requesterId)
      .slice(offset, offset + itemsPerPage)
      .map((user) => this.prepareAdminTableData(user));
    const tableData: IUserDataForTable[] = await Promise.all(usersDataForTable);

    const response: IUserDataForAdminTableResponse = {
      status: HttpStatus.OK,
      data: {
        usersData: tableData,
        params: {
          totalAmountOfUsers: count,
          page: calculatedPage,
          totalAmountOfPages: totalPages,
        },
      },
    };
    return response;
  }

  async getDataForFiltersInAdminTable(
    requesterId: number,
  ): Promise<IFiltersDataForAdminTableResponse> {
    const requester: User = await this.findUserByID(requesterId);

    const membersOfRequesterBusiness: User[] = await this.userRepository.findAll({
      where: { businessId: requester.businessId },
    });
    if (!membersOfRequesterBusiness || membersOfRequesterBusiness.length === 0) {
      throw new HttpException(makeNotFoundMessage('Users'), HttpStatus.NOT_FOUND);
    }

    const tableFiltersData: IFiltersDataForTable = await this.prepareAdminTableFiltersData(
      membersOfRequesterBusiness,
    );

    const response: IFiltersDataForAdminTableResponse = {
      status: HttpStatus.OK,
      data: tableFiltersData,
    };
    return response;
  }

  async getUserByID(id: number): Promise<IBasicUserResponse> {
    const userData: User = await this.findUserByID(id);
    const response: IBasicUserResponse = { status: HttpStatus.OK, data: userData };
    return response;
  }

  async reinviteUser(invitedUserId: number, inviterUserId: number): Promise<IBasicResponse> {
    const invitedUser: User = await this.findUserByID(invitedUserId);
    const invitedUserParams: UsersParams =
      await this.userParamsService.getUserParams(invitedUserId);

    const dataForInvite: IInviteDto = {
      inviterId: inviterUserId,
      invitedUserEmail: invitedUser.email,
      invitedUserFirstName: invitedUser.firstName,
      inviteLink: invitedUserParams.inviteLink,
    };

    await this.sendInvite(dataForInvite);
    const response: IBasicResponse = {
      status: HttpStatus.OK,
      message: makeSuccessInvitingMessage(),
    };
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

  async cancelUserInvite(id: number): Promise<IBasicResponse> {
    const user: User = await this.findUserByID(id);
    const userParams: UsersParams = await this.userParamsService.getUserParams(id);

    await user.destroy();
    await userParams.destroy();
    await UserStationRole.destroy({ where: { userId: id } });

    const response: IBasicResponse = { status: HttpStatus.OK, message: makeDeleteMessage('User') };
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
      invitedUserData: {
        userData: invitedUserInformation,
        isBusinessAdmin: userParams.isBusinessAdmin,
      },
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

  private async prepareAdminTableData(user: User): Promise<IUserDataForTable> {
    const userParams: UsersParams = await this.userParamsService.getUserParams(user.id);
    const userStations: UserStationRole[] = await UserStationRole.findAll({
      where: { userId: user.id },
      include: [{ model: Station }],
    });

    const generalInformationAboutUser: IGeneralData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName || null,
      email: user.email,
    };

    const paramsInformationAboutUser: IParamsData = {
      lastActiveTimestamp: userParams.lastActivityDate,
      status: userParams.status,
      statusChangeDate: userParams.statusChangeDate,
    };

    const assignedInfo: IAssignedToData[] = userStations.map((userStation) => ({
      stationId: userStation.station.id,
      stationName: userStation.station.name,
      stationMerchantId: userStation.station.merchantId,
      stationStoreId: userStation.station.storeId,
      stationAddress: userStation.station.address,
      userRole: userStation.role,
    }));

    return {
      general: generalInformationAboutUser,
      params: paramsInformationAboutUser,
      assigned: assignedInfo,
    };
  }

  private async prepareAdminTableFiltersData(
    businessMembers: User[],
  ): Promise<IFiltersDataForTable> {
    const usersStatuses = new Set<string>();
    const stationsLocations = new Set<string>();
    const stationsNames: IFilterOptionAdvancedData[] = [];

    for (const member of businessMembers) {
      const memberParams: UsersParams = await this.userParamsService.getUserParams(member.id);
      usersStatuses.add(memberParams.status);
    }

    const uniqueStationNames: string[] = [];

    for (const member of businessMembers) {
      const memberStations: UserStationRole[] = await UserStationRole.findAll({
        where: { userId: member.id },
        include: [{ model: Station }],
      });
      for (const station of memberStations) {
        const { name, address } = station.station;
        stationsLocations.add(address);

        if (!uniqueStationNames.includes(name)) {
          uniqueStationNames.push(name);
          stationsNames.push({ mainValue: name, secondaryValue: address });
        }
      }
    }

    const result: IFiltersDataForTable = {
      usersStatuses: Array.from(usersStatuses).sort(),
      stationsLocations: Array.from(stationsLocations).sort(),
      stationsNames: stationsNames.sort((a, b) => a.mainValue.localeCompare(b.mainValue)),
    };
    return result;
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

  async addUserAssignToStation(
    userId: number,
    stationId: number,
    role: UserStationRoleTypes,
  ): Promise<void> {
    const station: Station | null = await Station.findByPk(stationId);

    if (!station) {
      throw new HttpException(makeNotFoundMessage('Station'), HttpStatus.NOT_FOUND);
    }

    await UserStationRole.create({ userId, stationId: station.id, role: role });
  }

  async sendInvite(inviteData: IInviteDto): Promise<void> {
    const inviterData: User = await this.findUserByID(inviteData.inviterId);
    const inviterBusiness: Business = await this.businessService.findBusinessByID(
      inviterData.businessId,
    );

    const informationForInviteEmail: IUserInviteGeneratorArguments = {
      businessName: inviterBusiness.legalName,
      invitedUserFirstName: inviteData.invitedUserFirstName,
      inviterUserFirstName: inviterData.firstName,
      inviterUserLastName: inviterData.lastName,
      inviteLink: `${process.env.INVITE_ROUTE}${inviteData.inviteLink}`,
    };

    const transporter = nodemailer.createTransport({
      service: process.env.SUPPORT_EMAIL_SERVICE_NAME,
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
      },
    });

    const mailOptionsForInviteEmail = {
      from: process.env.SUPPORT_EMAIL,
      to: inviteData.invitedUserEmail,
      subject: 'Invitation',
      html: generateHTMLForEmailToInviteUser(informationForInviteEmail),
    };

    await transporter.sendMail(mailOptionsForInviteEmail);
  }
}
