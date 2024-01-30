import { Transaction } from 'src/transactions/transactions.model';

export interface IGetAllTransactionsResponse {
  status: number;
  data: Transaction[];
  totalCount?: number;
  amountOfPages?: number;
  currentPage?: number;
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
