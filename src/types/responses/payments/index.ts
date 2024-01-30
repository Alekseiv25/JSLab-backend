import { Payment } from 'src/payments/payments.model';

export interface IGetAllPaymentsResponse {
  status: number;
  data: Payment[];
  totalCount?: number;
  amountOfPages?: number;
  currentPage?: number;
}

export interface IBasicPaymentResponse {
  status: number;
  data: Payment;
}

export interface IDeletePaymentsResponse {
  status: number;
  message: string;
  data: Payment[];
}
