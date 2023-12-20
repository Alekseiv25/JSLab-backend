import { StationAccount } from 'src/accounts/accounts.model';
import { Station } from 'src/stations/stations.model';

export interface IBasicStationResponse {
  status: number;
  data: Station;
}

export interface IGetAllStationsResponse {
  status: number;
  data: Station[];
  totalCount?: number;
}

export interface ICheckStationNameResponse {
  status: number;
  message: string;
}

export interface IDeleteStationResponse {
  status: number;
  message: string;
  data: Station;
}

export interface IExampleResponse {
  data: StationAccount;
}
