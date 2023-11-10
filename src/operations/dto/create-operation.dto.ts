export class CreateOperationDto {
  day: string;
  readonly isOpen: boolean;
  readonly timeFrom: string;
  readonly timeTo: string;
  readonly isBreak: boolean;
  readonly timeBreakFrom: string;
  readonly timeBreakTo: string;
  readonly stationId: number;
}
