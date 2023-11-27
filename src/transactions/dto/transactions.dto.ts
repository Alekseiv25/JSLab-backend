export class CreateTransactionDto {
  readonly stationId: number;
  readonly businessId: number;
  readonly customerName: string;
  readonly fuelType: string;
  readonly rate: string;
  readonly costs: string;
  readonly discount: string;
  readonly amount: string;
}
