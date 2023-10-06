import { Station } from 'src/stations/stations.model';

export interface IBasicStationResponse {
  status: number;
  data: Station;
}

export interface IGetAllStationsResponse {
  status: number;
  data: Station[];
}

export interface ICheckStationEmailResponse {
  status: number;
  message: string;
}

export interface IDeleteStationResponse {
  status: number;
  message: string;
  data: Station;
}
