import { Account } from 'src/accounts/accounts.model';

export interface IBasicAccountResponse {
  statusCode: number;
  data: Account;
}

export interface IGetAllAccountsResponse {
  statusCode: number;
  data: Account[];
}

export interface IDeleteAccountResponse {
  statusCode: number;
  message: string;
  data: Account;
}
