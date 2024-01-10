export class CreateUsersStationsDto {
  readonly userId: number;
  readonly stationId: number;
  readonly role: 'Admin' | 'Member';
}
