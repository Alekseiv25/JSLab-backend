import { Business } from 'src/businesses/businesses.model';

export interface IBasicBusinessResponse {
  statusCode: number;
  data: Business;
}

export interface IGetAllBusinessResponse {
  statusCode: number;
  data: Business[];
}

export interface ICheckBusinessNameResponse {
  statusCode: number;
  message: string;
}

export interface IDeleteBusinessResponse {
  statusCode: number;
  message: string;
  data: Business;
}
