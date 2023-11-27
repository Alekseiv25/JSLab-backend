export class CreateUserDto {
  readonly businessId?: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  password: string;
  readonly status: 'Invited' | 'Active' | 'Suspended';
  readonly isAdmin?: boolean;
  readonly suspensionReason?: string;
  readonly isFinishedTutorial: boolean;
}
