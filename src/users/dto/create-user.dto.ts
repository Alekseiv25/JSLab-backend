export class CreateUserDto {
  readonly businessId?: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  password: string;
}
