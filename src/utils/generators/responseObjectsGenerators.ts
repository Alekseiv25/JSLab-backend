import { HttpStatus } from '@nestjs/common';
import { Station } from 'src/stations/stations.model';
import { IResponseStationDataObject } from 'src/types/responses';
import { IGetAllUsersResponse } from 'src/types/responses/users';
import { User } from 'src/users/users.model';

export function generateFoundAllUsersResponse(data: User[]): IGetAllUsersResponse {
  return {
    status: HttpStatus.OK,
    data: data,
  };
}

export function generateStationFoundResponse(data: Station): IResponseStationDataObject {
  return {
    status: HttpStatus.OK,
    data: data,
  };
}
