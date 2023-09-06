export class CreateUserDto {
  readonly email: string;
  password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly isAdmin?: boolean;
}
