import { StationAccount } from 'src/accounts/accounts.model';
import { Station } from 'src/stations/stations.model';
import { UserStationRoleTypes } from 'src/types/tableColumns';

export interface IBasicStationResponse {
  status: number;
  data: Station;
}

export interface Alesha1 {
  station: Station;
  userRole: UserStationRoleTypes;
}

export interface IGetAllStationsResponse {
  status: number;
  data: Alesha1[];
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

export interface IDeleteStationsResponse {
  status: number;
  message: string;
  data: Station[];
}

export interface IExampleResponse {
  data: StationAccount;
}
