export class CreateStationDto {
  readonly businessId: number;
  readonly accountId: number;
  readonly type: string;
  readonly brand: string;
  readonly name: string;
  readonly address: string;
  readonly lat: string;
  readonly lng: string;
  readonly phone: string;
  readonly email: string;
  readonly convenientStore: boolean;
  readonly groceries: boolean;
  readonly alcohol: boolean;
  readonly automotive: boolean;
  readonly ice: boolean;
  readonly tobacco: boolean;
  readonly lottery: boolean;
  readonly carWash: boolean;
  readonly restrooms: boolean;
  readonly ATM: boolean;
  readonly foodOfferings: boolean;
  readonly restaurant: boolean;
  readonly overnightParking: boolean;
  readonly showers: boolean;
  readonly POS: string;
}
