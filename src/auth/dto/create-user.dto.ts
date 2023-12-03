export class CreateNewUserDto {
  readonly businessId: number;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
  readonly password: string | null;
}
