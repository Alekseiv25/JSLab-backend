import { User } from 'src/users/users.model';

export class CreateNewUserDto {
  readonly businessId: number;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
  readonly password: string | null;
}

export class ActivateUserDto {
  readonly userID: number;
  readonly userData: Omit<User, 'id' | 'businessId'>;
}
