import { CreateUserParamsDto } from '../users_params/dto/create-users_params.dto';
import { UsersStationsService } from '../users_stations/users_stations.service';
import { IInviteDto, IUserAssignUpdateRequest } from '../types/requests/users';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersParamsService } from '../users_params/users_params.service';
import { FindOptions, IncludeOptions, Op, WhereOptions } from 'sequelize';
import { UsersStations } from '../users_stations/users_stations.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BusinessesService } from '../businesses/businesses.service';
import { UsersParams } from '../users_params/users_params.model';
import { UserStationRoleTypes } from '../types/tableColumns';
import { Business } from '../businesses/businesses.model';
import { CreateUserDto } from './dto/create-user.dto';
import { Station } from '../stations/stations.model';
import { IBasicResponse } from '../types/responses';
import { InjectModel } from '@nestjs/sequelize';
import * as nodemailer from 'nodemailer';
import { User } from './users.model';
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
  makeUnauthorizedMessage,
  makeSucceededMessage,
} from '../utils/generators/messageGenerators';
import {
  IUserParamsUpdateResponse,
  IInvitedUserDataResponse,
  IBasicUserResponse,
} from '../types/responses/users';
import {
  generateHTMLForEmailToInviteUser,
  IUserInviteGeneratorArguments,
} from '../utils/generators/emailGenerators';
import {
  IFiltersDataForAdminTableResponse,
  IUserDataForAdminTableResponse,
  IFilterOptionAdvancedData,
  IFiltersDataForTable,
  IUserDataForTable,
  IAssignedToData,
  IGeneralData,
  IParamsData,
} from '../types/responses/users/admin_table';
import {
  IGlobalSearchUsersResponse,
  IUserDataForGlobalSearch,
} from '../types/responses/globalSEarch';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private userParamsService: UsersParamsService,
    private userStationsService: UsersStationsService,
    private businessService: BusinessesService,
    private notificationsService: NotificationsService,
  ) {}

  async getUsersDataForAdminTable(
    requesterId: number,
    page: number,
    itemsPerPage: number,
    userName: string,
    stationName: string,
    stationAddress: string,
    userStatus: string,
    targetUserId: number,
  ): Promise<IUserDataForAdminTableResponse> {
    const requester: User = await this.findUserByID(requesterId);

    const membersOfRequesterBusiness: User[] = await this.userRepository.findAll({
      where: {
        businessId: requester.businessId,
        id: { [Op.ne]: requesterId },
      },
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

    const userPosition = targetUserId
      ? (await this.userRepository.count({
          where: { businessId: requester.businessId, id: { [Op.gte]: targetUserId } },
        })) + 1
      : null;

    const calculatedPage: number = userPosition
      ? Math.ceil(userPosition / itemsPerPage)
      : Math.max(1, Math.min(page, totalPages));

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

  async getUsersBySearchValue(
    userId: number,
    searchValue: string,
    currentPage: number,
    itemsPerPage: number,
  ): Promise<IGlobalSearchUsersResponse> {
    const userParams: UsersParams = await this.userParamsService.getUserParams(userId);

    if (!userParams.isBusinessAdmin) {
      throw new HttpException(makeUnauthorizedMessage(), HttpStatus.BAD_REQUEST);
    }

    const user: User = await this.findUserByID(userId);

    const membersOfBusiness: User[] = await this.userRepository.findAll({
      where: {
        businessId: user.businessId,
        id: { [Op.ne]: userId },
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${searchValue}%` } },
          { lastName: { [Op.iLike]: `%${searchValue}%` } },
        ],
      },
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
    });

    const amountOfUsers: number = membersOfBusiness.length;
    const usersData: IUserDataForGlobalSearch[] = [];

    for (const member of membersOfBusiness) {
      const memberStations: UsersStations[] = await this.userStationsService.findAllRecordsByUserId(
        user.id,
      );

      const memberRoles: string[] = [];
      const memberStationNames: string[] = [];
      const memberStationAddresses: string[] = [];

      memberStations.forEach((station): void => {
        if (!memberRoles.includes(station.role)) {
          memberRoles.push(station.role);
        }
        if (!memberStationNames.includes(station.station.name)) {
          memberStationNames.push(station.station.name);
        }
        if (!memberStationAddresses.includes(station.station.address)) {
          memberStationAddresses.push(station.station.address);
        }
      });

      const memberObject: IUserDataForGlobalSearch = {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        role: memberRoles.join(', '),
        stationAddress: memberStationAddresses.join(', '),
        stationName: memberStationNames.join(', '),
      };

      usersData.push(memberObject);
    }

    const amountOfPages: number = Math.ceil(amountOfUsers / itemsPerPage);

    const response: IGlobalSearchUsersResponse = {
      status: HttpStatus.OK,
      data: {
        users: usersData,
        params: { amountOfUsers, amountOfPages, currentPage },
      },
    };
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

    const existingAssigns = await UsersStations.findAll({
      where: { userId: user.id },
      include: Station,
    });

    const updatedAssigns: { role: UserStationRoleTypes; stationIds: number[] }[] = [
      { role: 'Admin', stationIds: assignData.asAdmin || [] },
      { role: 'Member', stationIds: assignData.asMember || [] },
    ];

    const assignmentsToRemove: UsersStations[] = [];
    const stationIdsToAdd: { role: UserStationRoleTypes; stationId: number }[] = [];

    existingAssigns.forEach((assign) => {
      const updatedAssign = updatedAssigns.find((updated) => updated.role === assign.role);

      if (updatedAssign) {
        if (!updatedAssign.stationIds.includes(assign.stationId)) {
          assignmentsToRemove.push(assign);
        }
      } else {
        assignmentsToRemove.push(assign);
      }
    });

    updatedAssigns.forEach((updatedAssign) => {
      updatedAssign.stationIds.forEach((stationId) => {
        const existingAssign = existingAssigns.find(
          (assign) => assign.role === updatedAssign.role && assign.stationId === stationId,
        );

        if (!existingAssign) {
          stationIdsToAdd.push({ role: updatedAssign.role, stationId });
        }
      });
    });

    const stationsNamesToRemove = assignmentsToRemove.map((assign) => assign.station.name);
    const stationsNamesToAdd = await Promise.all(
      stationIdsToAdd.map(async (item) => {
        const station = await Station.findByPk(item.stationId);
        return station ? station.name : '';
      }),
    );

    await Promise.all(assignmentsToRemove.map((assign) => assign.destroy()));
    await Promise.all(
      stationIdsToAdd.map((item) =>
        UsersStations.create({
          userId: user.id,
          stationId: item.stationId,
          role: item.role,
        }),
      ),
    );

    const response: IBasicResponse = {
      status: HttpStatus.OK,
      message: makeSuccessUpdatingMessage(),
    };

    if (stationsNamesToRemove.length > 0) {
      await this.notificationsService.createNotificationsAboutRemovedOrAddedAssign(
        'Removed',
        user.id,
        stationsNamesToRemove,
      );
    }

    if (stationsNamesToAdd.length > 0) {
      await this.notificationsService.createNotificationsAboutRemovedOrAddedAssign(
        'Added',
        user.id,
        stationsNamesToAdd,
      );
    }

    return response;
  }

  async updateLastActivity(userId: number): Promise<IBasicResponse> {
    await this.userParamsService.updateUserLastActivityTimestamp(userId);

    const response: IBasicResponse = { status: HttpStatus.OK, message: makeSucceededMessage() };
    return response;
  }

  async cancelUserInvite(id: number): Promise<IBasicResponse> {
    const user: User = await this.findUserByID(id);
    const userParams: UsersParams = await this.userParamsService.getUserParams(id);

    await this.userStationsService.removeUserAssignToStation(null, id);
    await userParams.destroy();
    await user.destroy();

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
    const lowerCasedEmail: string = emailToCheck.toLowerCase();
    const user: User | null = await this.findUserByEmail(lowerCasedEmail);

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

  async findUserByBusinessId(businessId: number): Promise<User> {
    const user: User | null = await this.userRepository.findOne({ where: { businessId } });

    if (!user) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findUsersByBusinessId(businessId: number): Promise<User[]> {
    const user: User[] | null = await this.userRepository.findAll({ where: { businessId } });

    if (!user || user.length === 0) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findUserByID(userID: number): Promise<User> {
    const user: User | null = await this.userRepository.findByPk(userID);

    if (!user) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findUserStations(userId: number): Promise<UsersStations[]> {
    const userStations: UsersStations[] =
      await this.userStationsService.findAllRecordsByUserId(userId);

    return userStations;
  }

  private async prepareAdminTableData(user: User): Promise<IUserDataForTable> {
    const userParams: UsersParams = await this.userParamsService.getUserParams(user.id);
    const userStations: UsersStations[] = await this.userStationsService.findAllRecordsByUserId(
      user.id,
    );

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
      const memberStations: UsersStations[] = await UsersStations.findAll({
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

  async addUserAssignToStation(
    userId: number,
    stationId: number,
    role: UserStationRoleTypes,
  ): Promise<void> {
    const station: Station | null = await Station.findByPk(stationId);

    if (!station) {
      throw new HttpException(makeNotFoundMessage('Station'), HttpStatus.NOT_FOUND);
    }

    await UsersStations.create({ userId, stationId: station.id, role: role });
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

  async removeUserAssignOnStation(stationId: number): Promise<void> {
    await UsersStations.destroy({ where: { stationId: stationId } });
  }
}
