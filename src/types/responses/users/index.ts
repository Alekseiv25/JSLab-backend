import { UsersParams } from 'src/users_params/users_params.model';
import { User } from 'src/users/users.model';

export interface IBasicUserResponse {
  status: number;
  data: User;
}

export interface IDeleteUserResponse {
  status: number;
  message: string;
  data: User;
}

type IInvitedUserData = {
  userData: Pick<User, 'id' | 'firstName' | 'email'>;
  isBusinessAdmin: boolean;
};

export interface IInvitedUserDataResponse {
  status: number;
  invitedUserData: IInvitedUserData;
}

export interface IUserParamsUpdateResponse {
  status: number;
  updatedUserParams: UsersParams;
}
