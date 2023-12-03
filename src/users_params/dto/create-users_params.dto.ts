import { UserStatusTypes } from 'src/types/tableColumns';

export class CreateUserParamsDto {
  readonly userId: number;
  readonly status: UserStatusTypes;
  readonly statusChangeDate: string;
  readonly isAdmin: boolean;
  readonly suspensionReason: string;
  readonly isFinishedTutorial: boolean;
  readonly lastActivityDate: string;
}
