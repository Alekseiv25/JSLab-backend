export class CreateNewUserDto {
  readonly businessId?: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
}
