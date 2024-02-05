import { UserStatusTypes } from '../../types/tableColumns';

export class CreateUserParamsDto {
  readonly userId: number;
  readonly status: UserStatusTypes;
  readonly statusChangeDate: string;
  readonly isBusinessAdmin: boolean;
  readonly isFinishedTutorial: boolean;
  readonly lastActivityDate: string;
  readonly inviteLink: string;
}
