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

export interface IDeleteUserResponse {
  status: number;
  message: string;
  data: User;
}

export interface IResponseJWT {
  token: string;
}
