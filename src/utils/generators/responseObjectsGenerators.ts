import { Station } from 'src/stations/stations.model';
import { IBasicResponseObject, IResponseObjectWithStationData } from 'src/types/responses';

enum StatusCodes {
  OK = 200,
  NOT_FOUND = 404,
}

export function generateNotFoundResponse(entityName: string): IBasicResponseObject {
  return {
    status: StatusCodes.NOT_FOUND,
    message: `The ${entityName} was not found in the database!`,
  };
}

export function generateStationFoundResponse(data: Station): IResponseObjectWithStationData {
  return { status: StatusCodes.OK, data: data };
}
