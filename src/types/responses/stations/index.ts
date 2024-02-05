import { StationAccount } from '../../../accounts/accounts.model';
import { Station } from '../../../stations/stations.model';
import { IPaginationParams } from '../../../types/responses/index';

interface IStationData {
  station: Station;
  userStatus: string;
}
export interface IGetStationResponse {
  status: number;
  data: IStationData;
}

export interface IBasicStationResponse {
  status: number;
  data: Station;
}

export interface IGetAllStationsResponse {
  status: number;
  data: {
    stations: Station[];
    params?: IPaginationParams;
  };
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

export interface IDeleteStationsResponse {
  status: number;
  message: string;
  data: Station[];
}

export interface IExampleResponse {
  data: StationAccount;
}
