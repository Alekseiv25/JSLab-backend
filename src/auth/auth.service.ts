import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserParamsDto } from 'src/users_params/dto/create-users_params.dto';
import { ILoginUserData, IUserInvitationRequest } from 'src/types/requests/users';
import { UsersParamsService } from 'src/users_params/users_params.service';
import { IRefreshToken, TokensService } from 'src/tokens/tokens.service';
import { BusinessesService } from 'src/businesses/businesses.service';
import { UsersParams } from 'src/users_params/users_params.model';
import { User, UserStationRole } from 'src/users/users.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserStationRoleTypes } from 'src/types/tableColumns';
import { Business } from 'src/businesses/businesses.model';
import { CreateNewUserDto } from './dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Station } from 'src/stations/stations.model';
import { IBasicResponse } from 'src/types/responses';
import { Token } from 'src/tokens/tokens.model';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import {
  IUserInviteGeneratorArguments,
  generateHTMLForEmailToInviteUser,
} from 'src/utils/generators/emailGenerators';
import {
  makeConflictMessage,
  makeDeleteMessage,
  makeNotCorrectDataMessage,
  makeNotFoundMessage,
  makeSuccessInvitingMessage,
  makeUnauthorizedMessage,
} from 'src/utils/generators/messageGenerators';
import {
  ICheckUserEmailResponse,
  IRefreshResponseJWT,
  IRegistrationResponseJWT,
  ILoginResponse,
  ILogoutResponse,
} from 'src/types/responses/users';

export interface ITokensCreationResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private userParamsService: UsersParamsService,
    private businessService: BusinessesService,
    private tokensService: TokensService,
  ) {}

  async refresh(refreshToken: string): Promise<IRefreshResponseJWT> {
    if (!refreshToken) {
      throw new HttpException(makeUnauthorizedMessage(), HttpStatus.UNAUTHORIZED);
    }

    const userDataFromToken: IRefreshToken | null =
      this.tokensService.validateRefreshToken(refreshToken);
    const tokenFromDB: Token = await this.tokensService.findTokenInDB(refreshToken);

    if (!userDataFromToken || !tokenFromDB) {
      throw new HttpException(makeUnauthorizedMessage(), HttpStatus.UNAUTHORIZED);
    }

    const user: User = await this.userService.getUserInformation(userDataFromToken.id);

    if (!user) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    const tokens: ITokensCreationResponse = await this.tokensService.generateToken(user);
    await this.tokensService.saveToken(user.id, tokens.refreshToken);

    const response: IRefreshResponseJWT = {
      status: HttpStatus.OK,
      data: { ...tokens, user: user },
    };
    return response;
  }

  async registration(
    userDto: CreateNewUserDto,
  ): Promise<IRegistrationResponseJWT | ICheckUserEmailResponse> {
    await this.checkEmailUniqueness(userDto.email);

    const hashPassword: string = await bcrypt.hash(userDto.password, 10);
    const newUser: User = await this.createNewUser(userDto, hashPassword);
    await this.createNewUserParams(newUser.id, false);

    const tokens: ITokensCreationResponse = await this.tokensService.generateToken(newUser);
    await this.tokensService.saveToken(newUser.id, tokens.refreshToken);

    const response: IRegistrationResponseJWT = {
      status: HttpStatus.CREATED,
      data: { ...tokens, createdUser: newUser },
    };
    return response;
  }

  async login(userData: ILoginUserData): Promise<ILoginResponse> {
    const user: User | null = await this.userService.findUserByEmail(userData.email);
    const userParams: UsersParams | null = await this.userParamsService.getUserParams(user.id);

    if (!user) {
      throw new HttpException(makeNotCorrectDataMessage(), HttpStatus.UNAUTHORIZED);
    }

    const isPasswordsEquals: boolean = await bcrypt.compare(userData.password, user.password);

    if (!isPasswordsEquals) {
      throw new HttpException(makeNotCorrectDataMessage(), HttpStatus.UNAUTHORIZED);
    }

    const tokens: ITokensCreationResponse = await this.tokensService.generateToken(user);
    await this.tokensService.saveToken(user.id, tokens.refreshToken);

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
          isFinishedTutorial: userParams.isFinishedTutorial,
        },
        tokens: {
          ...tokens,
        },
      },
    };

    return response;
  }

  async logout(refreshToken: string): Promise<ILogoutResponse> {
    await this.tokensService.removeRefreshToken(refreshToken);

    const response: ILogoutResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('Token'),
    };

    return response;
  }

  async invite(requestData: IUserInvitationRequest): Promise<IBasicResponse> {
    await this.userParamsService.updateUserLastActivityTimestamp(requestData.inviterId);
    await this.checkEmailUniqueness(requestData.invitedUserData.emailAddress);

    const userDataForCreation: CreateNewUserDto = {
      businessId: requestData.inviterBusinessId,
      firstName: requestData.invitedUserData.firstName,
      lastName: null,
      email: requestData.invitedUserData.emailAddress,
      password: null,
    };

    const newUser: User = await this.createNewUser(userDataForCreation);
    const inviteLink: string = await bcrypt.hash(newUser.email, 10);
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

    await this.sendInvite(requestData, inviteLink);

    const response: IBasicResponse = {
      statusCode: HttpStatus.OK,
      message: makeSuccessInvitingMessage(),
    };
    return response;
  }

  private async sendInvite(inviteData: IUserInvitationRequest, inviteLink: string): Promise<void> {
    const inviterData: User = await this.userService.findUserByID(inviteData.inviterId);
    const inviterBusiness: Business = await this.businessService.findBusinessByID(
      inviteData.inviterBusinessId,
    );

    const informationForInviteEmail: IUserInviteGeneratorArguments = {
      businessName: inviterBusiness.legalName,
      invitedUserFirstName: inviteData.invitedUserData.firstName,
      inviterUserFirstName: inviterData.firstName,
      inviterUserLastName: inviterData.lastName,
      inviteLink: `${process.env.INVITE_ROUTE}${inviteLink}`,
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
      to: inviteData.invitedUserData.emailAddress,
      subject: 'Invitation',
      html: generateHTMLForEmailToInviteUser(informationForInviteEmail),
    };

    await transporter.sendMail(mailOptionsForInviteEmail);
  }

  private async assignUserWithStations(
    stationsIDs: number[],
    userID: number,
    role: UserStationRoleTypes,
  ): Promise<void> {
    for (const stationId of stationsIDs) {
      const station: Station | null = await Station.findByPk(stationId);
      if (station) {
        await UserStationRole.create({
          userId: userID,
          stationId: station.id,
          role: role,
        });
      }
    }
  }

  private async checkEmailUniqueness(emailAddress: string): Promise<void> {
    const userWithSuchEmail: User | null = await this.userService.findUserByEmail(emailAddress);
    if (userWithSuchEmail) {
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
      suspensionReason: null,
      inviteLink: inviteLink || null,
    };
    const newUserParams: UsersParams =
      await this.userParamsService.createParamsForNewUser(newUserParamsData);
    return newUserParams;
  }
}
