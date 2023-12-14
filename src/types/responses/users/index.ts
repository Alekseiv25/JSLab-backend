import { UserStationRoleTypes, UserStatusTypes } from 'src/types/tableColumns';
import { UsersParams } from 'src/users_params/users_params.model';
import { User } from 'src/users/users.model';

export interface IBasicUserResponse {
  status: number;
  data: User;
}

export interface IGetAllUsersResponse {
  status: number;
  data: User[];
}

export interface IDeleteUserResponse {
  status: number;
  message: string;
  data: User;
}

type RegistrationResponseDataType = {
  accessToken: string;
  refreshToken: string;
  createdUser: User;
};

export interface IRegistrationResponseJWT {
  status: number;
  data: RegistrationResponseDataType;
}

type RefreshResponseType = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export interface IRefreshResponseJWT {
  status: number;
  data: RefreshResponseType;
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

export interface IUserGeneralInformationForAdmin {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
}

export interface IUserParamsInformationForAdmin {
  lastActiveTimestamp: string;
  status: UserStatusTypes;
  statusChangeDate: string;
}

export interface IUserAssignedInformationForAdmin {
  stationId: number;
  stationName: string;
  stationMerchantId: string;
  stationStoreId: string;
  userRole: UserStationRoleTypes;
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

export interface IInvitedUserDataResponse {
  status: number;
  invitedUserData: Pick<User, 'id' | 'firstName' | 'email'>;
}
