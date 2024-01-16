import { CreatePaymentDto } from 'src/payments/dto/payments.dto';

export interface ICreatePaymentRequest {
  userId: number;
  paymentCreationData: CreatePaymentDto;
}

export interface IDeletePaymentsRequest {
  userId: number;
  paymentsIdsForDelete: number[];
}
