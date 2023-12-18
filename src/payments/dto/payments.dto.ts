export class CreatePaymentDto {
  readonly stationId: number;
  readonly businessId: number;
  readonly accountId: number;
  readonly paymentName: string;
  readonly paymentAmount: string;
}
