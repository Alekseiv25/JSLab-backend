import { HttpStatus } from '@nestjs/common';
import { Station } from 'src/stations/stations.model';
import { IResponseStationDataObject } from 'src/types/responses';

export function generateStationFoundResponse(data: Station): IResponseStationDataObject {
  return {
    status: HttpStatus.OK,
    data: data,
  };
}
