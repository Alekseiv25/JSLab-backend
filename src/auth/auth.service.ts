import { IInviteDto, ILoginUserData, IUserInvitationRequest } from '../types/requests/users';
import { UsersStationsService } from '../users_stations/users_stations.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersParamsService } from '../users_params/users_params.service';
import { ActivateUserDto, CreateNewUserDto } from './dto/create-user.dto';
import { IRefreshToken, TokensService } from '../tokens/tokens.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersParams } from '../users_params/users_params.model';
import { IBasicUserResponse } from '../types/responses/users';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserStationRoleTypes } from '../types/tableColumns';
import { UsersService } from '../users/users.service';
import { Station } from '../stations/stations.model';
import { IBasicResponse } from '../types/responses';
import { Token } from '../tokens/tokens.model';
import { User } from '../users/users.model';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import {
  makeConflictMessage,
  makeDeleteMessage,
  makeNotActivatedAccountMessage,
  makeNotCorrectDataMessage,
  makeSuccessInvitingMessage,
  makeSuspendMessage,
  makeUnauthorizedMessage,
} from '../utils/generators/messageGenerators';
import {
  ILoginResponse,
  IRefreshResponseJWT,
  IRegistrationResponseJWT,
} from '../types/responses/users/registration';
import { CreateUserParamsDto } from '../users_params/dto/create-users_params.dto';

export interface ITokensCreationResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private userParamsService: UsersParamsService,
    private notificationsService: NotificationsService,
    private userStationsService: UsersStationsService,
    private tokensService: TokensService,
  ) {}

  async refresh(refreshToken: string): Promise<IRefreshResponseJWT> {
    if (!refreshToken) {
      throw new HttpException(makeUnauthorizedMessage(), HttpStatus.FORBIDDEN);
    }

    const userDataFromToken: IRefreshToken | null =
      this.tokensService.validateRefreshToken(refreshToken);

    if (!userDataFromToken) {
      await this.tokensService.removeRefreshToken(refreshToken);
      throw new HttpException(makeUnauthorizedMessage(), HttpStatus.FORBIDDEN);
    }

    const tokenFromDB: Token = await this.tokensService.findTokenInDB(refreshToken);

    if (!tokenFromDB) {
      throw new HttpException(makeUnauthorizedMessage(), HttpStatus.UNAUTHORIZED);
    }

    const user: User = await this.userService.findUserByID(userDataFromToken.id);
    const tokens: ITokensCreationResponse = await this.generateTokens(user);

    const response: IRefreshResponseJWT = {
      status: HttpStatus.OK,
      data: { ...tokens, user: user },
    };
    return response;
  }

  async registration(userDto: CreateNewUserDto): Promise<IRegistrationResponseJWT> {
    await this.checkEmailUniqueness(userDto.email);

    const hashPassword: string = await bcrypt.hash(userDto.password, 10);
    const newUser: User = await this.createNewUser(userDto, hashPassword);
    await this.createNewUserParams(newUser.id, false);
    const userParams: UsersParams = await this.userParamsService.getUserParams(newUser.id);
    const tokens: ITokensCreationResponse = await this.generateTokens(newUser);

    const response: IRegistrationResponseJWT = {
      status: HttpStatus.CREATED,
      data: { ...tokens, isBusinessAdmin: userParams.isBusinessAdmin, createdUser: newUser },
    };
    return response;
  }

  async activateInvitedUserAccount(userDto: ActivateUserDto): Promise<IRegistrationResponseJWT> {
    const activatedUser: User = await this.updateInvitedUser(userDto);
    await this.updateInvitedUserParams(activatedUser.id);

    const inviter: User = await this.userService.findUserByBusinessId(activatedUser.businessId);
    await this.notificationsService.createActivationNotificationForAdmin(
      inviter.id,
      `${activatedUser.firstName} ${activatedUser.lastName}`,
    );

    const tokens: ITokensCreationResponse = await this.generateTokens(activatedUser);
    const userParams: UsersParams = await this.userParamsService.getUserParams(activatedUser.id);

    const response: IRegistrationResponseJWT = {
      status: HttpStatus.CREATED,
      data: { ...tokens, isBusinessAdmin: userParams.isBusinessAdmin, createdUser: activatedUser },
    };
    return response;
  }

  async login(userData: ILoginUserData): Promise<ILoginResponse> {
    const user: User | null = await this.userService.findUserByEmail(userData.email);

    if (!user) {
      throw new HttpException(makeNotCorrectDataMessage(), HttpStatus.UNAUTHORIZED);
    }

    if (!user.password) {
      throw new HttpException(makeNotActivatedAccountMessage(), HttpStatus.NOT_FOUND);
    }

    const userParams: UsersParams = await this.userParamsService.getUserParams(user.id);
    const isPasswordsEquals: boolean = await bcrypt.compare(userData.password, user.password);

    if (!isPasswordsEquals) {
      throw new HttpException(makeNotCorrectDataMessage(), HttpStatus.UNAUTHORIZED);
    }

    if (userParams.status === 'Suspended') {
      throw new HttpException(makeSuspendMessage(), HttpStatus.FORBIDDEN);
    }

    const tokens: ITokensCreationResponse = await this.generateTokens(user);

    const response: ILoginResponse = {
      status: HttpStatus.OK,
      data: {
        userData: {
          id: user.id,
          userBusinessId: user.businessId,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        userParams: {
          isBusinessAdmin: userParams.isBusinessAdmin,
          isFinishedTutorial: userParams.isFinishedTutorial,
        },
        tokens: {
          ...tokens,
        },
      },
    };

    return response;
  }

  async logout(refreshToken: string): Promise<IBasicResponse> {
    await this.tokensService.removeRefreshToken(refreshToken);

    const response: IBasicResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('Token'),
    };

    return response;
  }

  async invite(requestData: IUserInvitationRequest): Promise<IBasicResponse> {
    await this.checkEmailUniqueness(requestData.invitedUserData.emailAddress);

    const userDataForCreation: CreateNewUserDto = {
      businessId: requestData.inviterBusinessId,
      firstName: requestData.invitedUserData.firstName,
      lastName: null,
      email: requestData.invitedUserData.emailAddress,
      password: null,
    };

    const newUser: User = await this.createNewUser(userDataForCreation);
    const inviteLink: string = uuidv4();
    await this.createNewUserParams(newUser.id, true, inviteLink);

    if (requestData.assignmentToStationAsAdmin?.length > 0) {
      await this.assignUserWithStations(
        requestData.assignmentToStationAsAdmin,
        newUser.id,
        'Admin',
      );
    }

    if (requestData.assignmentToStationAsMember?.length > 0) {
      await this.assignUserWithStations(
        requestData.assignmentToStationAsMember,
        newUser.id,
        'Member',
      );
    }

    const dataForInvite: IInviteDto = {
      inviterId: requestData.inviterId,
      invitedUserFirstName: newUser.firstName,
      invitedUserEmail: requestData.invitedUserData.emailAddress,
      inviteLink: inviteLink,
    };

    await this.userService.sendInvite(dataForInvite);

    const response: IBasicResponse = {
      status: HttpStatus.OK,
      message: makeSuccessInvitingMessage(),
    };
    return response;
  }

  private async generateTokens(user: User): Promise<ITokensCreationResponse> {
    const userParams: UsersParams = await this.userParamsService.getUserParams(user.id);
    const tokens: ITokensCreationResponse = await this.tokensService.generateToken(
      user,
      userParams,
    );
    await this.tokensService.saveToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private async assignUserWithStations(
    stationsIDs: number[],
    userID: number,
    role: UserStationRoleTypes,
  ): Promise<void> {
    for (const stationId of stationsIDs) {
      const station: Station | null = await Station.findByPk(stationId);
      if (station) {
        await this.userStationsService.createNewRecord({
          userId: userID,
          stationId: station.id,
          role: role,
        });
      }
    }
  }

  private async checkEmailUniqueness(emailAddress: string): Promise<void> {
    const isEmailUnique: boolean = await this.userService.checkIsEmailUnique(emailAddress);

    if (!isEmailUnique) {
      throw new HttpException(makeConflictMessage('Email'), HttpStatus.CONFLICT);
    }
  }

  private async createNewUser(userDto: CreateNewUserDto, hashPassword?: string): Promise<User> {
    const newUserData: CreateUserDto = {
      businessId: userDto.businessId,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      email: userDto.email,
      password: hashPassword ? hashPassword : null,
    };
    const newUser: User = await this.userService.createUser(newUserData);
    return newUser;
  }

  private async createNewUserParams(
    newUserId: number,
    isInvited: boolean,
    inviteLink?: string,
  ): Promise<UsersParams> {
    const currentTimestamp: string = String(new Date().getTime());
    const newUserParamsData: CreateUserParamsDto = {
      userId: newUserId,
      isBusinessAdmin: isInvited ? false : true,
      status: isInvited ? 'Invited' : 'Active',
      statusChangeDate: currentTimestamp,
      lastActivityDate: currentTimestamp,
      isFinishedTutorial: false,
      inviteLink: inviteLink || null,
    };
    const newUserParams: UsersParams =
      await this.userParamsService.createParamsForNewUser(newUserParamsData);
    return newUserParams;
  }

  private async updateInvitedUser(invitedUserDto: ActivateUserDto): Promise<User> {
    const userDataForUpdate: Partial<CreateUserDto> = {
      lastName: invitedUserDto.userData.lastName,
      password: invitedUserDto.userData.password,
    };

    const invitedUser: IBasicUserResponse = await this.userService.updateUserByID(
      invitedUserDto.userID,
      userDataForUpdate,
    );
    return invitedUser.data;
  }

  private async updateInvitedUserParams(invitedUserId: number) {
    const currentTimestamp: string = String(new Date().getTime());

    const dataForUpdatingUserParams: Partial<CreateUserParamsDto> = {
      isFinishedTutorial: true,
      lastActivityDate: currentTimestamp,
      status: 'Active',
      statusChangeDate: currentTimestamp,
    };

    const updatedUserParams: UsersParams = await this.userParamsService.updateUserParams(
      invitedUserId,
      dataForUpdatingUserParams,
    );
    return updatedUserParams;
  }
}
