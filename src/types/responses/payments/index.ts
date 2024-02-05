import { Payment } from '../../../payments/payments.model';
import { IPaginationParams } from '../../../types/responses/index';

export interface IGetAllPaymentsResponse {
  status: number;
  data: {
    payments: Payment[];
    params?: IPaginationParams;
  };
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
