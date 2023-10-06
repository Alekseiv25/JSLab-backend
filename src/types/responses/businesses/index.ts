import { Business } from 'src/businesses/businesses.model';

export interface IBasicBusinessResponse {
  status: number;
  data: Business;
}

export interface IGetAllBusinessResponse {
  status: number;
  data: Business[];
}

export interface ICheckBusinessNameResponse {
  status: number;
  message: string;
}

export interface IDeleteBusinessResponse {
  status: number;
  message: string;
  data: Business;
}
