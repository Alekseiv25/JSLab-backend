export class CreateUserParamsDto {
  readonly userId: number;
  readonly status: 'Invited' | 'Active' | 'Suspended';
  readonly statusChangeDate: string;
  readonly isAdmin: boolean;
  readonly suspensionReason: string;
  readonly isFinishedTutorial: boolean;
  readonly lastActivityDate: string;
}
