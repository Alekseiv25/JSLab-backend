export class CreateFuelPriceDto {
  readonly stationId: number;
  readonly fuelType: string;
  readonly grade: string;
  readonly displayName: string;
  readonly rate: string;
  readonly price: number;
  readonly minDiscount: number;
  readonly maxDiscount: number;
}
