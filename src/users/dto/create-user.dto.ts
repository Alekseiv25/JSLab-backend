export class CreateUserDto {
  readonly businessId: number;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
  password: string | null;
}
