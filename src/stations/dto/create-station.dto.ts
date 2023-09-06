export class CreateStationDto {
  readonly businessId: number;
  readonly type: string;
  readonly brand: string;
  readonly name: string;
  readonly adress: string;
  readonly latitiud: number;
  readonly longitude: number;
  readonly phone: string;
  readonly email: string;
  readonly convenientStrore: boolean;
  readonly groceries: boolean;
  readonly alcohol: boolean;
  readonly automotive: boolean;
  readonly ice: boolean;
  readonly tabacco: boolean;
  readonly lottery: boolean;
  readonly carWash: boolean;
  readonly restrooms: boolean;
  readonly ATM: boolean;
  readonly foodOfferings: boolean;
  readonly restaurant: boolean;
  readonly overnightParking: boolean;
  readonly showers: boolean;
}
