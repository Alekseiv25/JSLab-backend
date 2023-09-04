import { userBusinessData, userLocationData } from '../../interfaces/interfaces';

export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly userBusiness: userBusinessData;
  readonly userLocation: userLocationData;
}