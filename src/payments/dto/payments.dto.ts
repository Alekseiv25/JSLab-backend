export class CreatePaymentDto {
  readonly stationId: number;
  readonly businessId: number;
  readonly accountId: number;
  readonly paymentAmount: string;
}
