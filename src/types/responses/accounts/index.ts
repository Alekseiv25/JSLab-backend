import { Account } from '../../../accounts/accounts.model';

export interface IBasicAccountResponse {
  status: number;
  data: Account;
}

export interface IGetAllAccountsResponse {
  status: number;
  data: Account[];
}

export interface IDeleteAccountResponse {
  status: number;
  message: string;
  data: Account;
}
