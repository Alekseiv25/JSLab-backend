import { Transaction } from 'src/transactions/transactions.model';
import { IPaginationParams } from 'src/types/responses/index';

export interface IGetAllTransactionsResponse {
  status: number;
  data: {
    transactions: Transaction[];
    params?: IPaginationParams;
  };
}

export interface IBasicTransactionResponse {
  status: number;
  data: Transaction;
}

export interface IDeleteTransactionResponse {
  status: number;
  message: string;
  data: Transaction;
}

export interface IDeleteTransactionsResponse {
  status: number;
  message: string;
  data: Transaction[];
}
