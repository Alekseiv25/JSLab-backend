import { StationAccount } from 'src/accounts/accounts.model';
import { Station } from 'src/stations/stations.model';

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
  data: Station[];
  totalCount?: number;
  amountOfPages?: number;
  currentPage?: number;
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
