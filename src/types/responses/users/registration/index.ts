import { User } from 'src/users/users.model';

type RegistrationResponseDataType = {
  accessToken: string;
  refreshToken: string;
  createdUser: User;
  isBusinessAdmin: boolean;
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
  isBusinessAdmin: boolean;
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
