import { User } from 'src/users/users.model';

export interface IBasicUserResponse {
  statusCode: number;
  data: User;
}

export interface IGetAllUsersResponse {
  statusCode: number;
  data: User[];
}

export interface ICheckUserEmailResponse {
  statusCode: number;
  message: string;
}

export interface IDeleteUserResponse {
  statusCode: number;
  message: string;
  data: User;
}

export interface IResponseJWT {
  token: string;
}
