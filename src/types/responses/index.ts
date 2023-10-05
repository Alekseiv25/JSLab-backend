import { StationTableColumns } from '../tableColumns';

export interface IBasicResponseObject {
  status: number;
  message: string;
}

export interface IResponseStationDataObject {
  status: number;
  data: StationTableColumns;
}

export interface IResponseJWT {
  token: string;
}
