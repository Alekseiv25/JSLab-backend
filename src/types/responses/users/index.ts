import { UserStatusTypes } from 'src/types/tableColumns';
import { User } from 'src/users/users.model';
import { UsersParams } from 'src/users_params/users_params.model';

export interface IBasicUserResponse {
  status: number;
  data: User;
}

export interface IGetAllUsersResponse {
  status: number;
  data: User[];
}

export interface ICheckUserEmailResponse {
  status: number;
  message: string;
}

export interface IValidateUserPasswordResponse {
  status: number;
  message: string;
}

export interface IDeleteUserResponse {
  status: number;
  message: string;
  data: User;
}

type BasicRegistrationResponseJWT = {
  accessToken: string;
  refreshToken: string;
  createdUser: User;
};

export interface IRegistrationResponseJWT {
  status: number;
  data: BasicRegistrationResponseJWT;
}

type BasicRefreshResponseJWT = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export interface IRefreshResponseJWT {
  status: number;
  data: BasicRefreshResponseJWT;
}

interface ILoginUserData {
  id: number;
  userBusinessId: number;
  firstName: string;
  lastName: string;
}

interface ILoginUserParams {
  isFinishedTutorial: boolean;
}

interface ILoginUserTokens {
  accessToken: string;
  refreshToken: string;
}

type LoginResponseData = {
  userData: ILoginUserData;
  userParams: ILoginUserParams;
  tokens: ILoginUserTokens;
};

export interface ILoginResponse {
  status: number;
  data: LoginResponseData;
}

export interface ILogoutResponse {
  status: number;
  message: string;
}

export interface IUserGeneralInformationForAdmin {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
}

export interface IUserParamsInformationForAdmin {
  lastActiveDate: string;
  lastActiveTime: string;
  permissionLevel: 'Admin' | 'Member';
  status: UserStatusTypes;
  statusChangeDate: string;
}

export interface IUserAssignedInformationForAdmin {
  stationId: number;
  stationName: string;
  stationMerchantId: string;
  stationStoreId: string;
}

export interface IUserInformationForAdmin {
  general: IUserGeneralInformationForAdmin;
  params: IUserParamsInformationForAdmin;
  assigned: IUserAssignedInformationForAdmin[] | [];
}

export interface IUserInformationForAdminResponse {
  status: number;
  data: IUserInformationForAdmin[];
}

export interface IUserParamsUpdateResponse {
  status: number;
  updatedUserParams: UsersParams;
}
