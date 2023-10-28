import { User } from 'src/users/users.model';

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

type LoginResponseData = {
  userData: User;
  accessToken: string;
  refreshToken: string;
};

export interface ILoginResponse {
  status: number;
  data: LoginResponseData;
}
