export interface ILoginUserData {
  email: string;
  password: string;
}

export interface IUpdateUserTutorialStatus {
  isFinishedTutorial: boolean;
}

interface IInvitedUserData {
  emailAddress: string;
  firstName: string;
}

export interface IUserInvitationRequest {
  inviterId: number;
  inviterBusinessId: number;
  invitedUserData: IInvitedUserData;
  assignmentToStationAsAdmin: number[];
  assignmentToStationAsMember: number[];
}

export interface IUserAssignUpdateRequest {
  asAdmin: number[];
  asMember: number[];
}
