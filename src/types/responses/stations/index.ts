import { Station } from 'src/stations/stations.model';

export interface IBasicStationResponse {
  statusCode: number;
  data: Station;
}

export interface IGetAllStationsResponse {
  statusCode: number;
  data: Station[];
}

export interface ICheckStationEmailResponse {
  statusCode: number;
  message: string;
}

export interface IDeleteStationResponse {
  statusCode: number;
  message: string;
  data: Station;
}
