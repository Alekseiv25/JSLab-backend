import { UserStationRoleTypes, UserStatusTypes } from 'src/types/tableColumns';

export interface IGeneralData {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
}

export interface IParamsData {
  lastActiveTimestamp: string;
  status: UserStatusTypes;
  statusChangeDate: string;
}

export interface IAssignedToData {
  stationId: number;
  stationName: string;
  stationMerchantId: string;
  stationStoreId: string;
  stationAddress: string;
  userRole: UserStationRoleTypes;
}

export interface IUserDataForTable {
  general: IGeneralData;
  params: IParamsData;
  assigned: IAssignedToData[] | [];
}

export interface IFilterOptionAdvancedData {
  mainValue: string;
  secondaryValue: string;
}

export interface IFiltersDataForTable {
  usersStatuses: string[];
  stationsLocations: string[];
  stationsNames: IFilterOptionAdvancedData[];
}

export interface IUserDataForAdminTableParams {
  totalAmountOfUsers: number;
  totalAmountOfPages: number;
  page: number;
}

export interface IUserDataForAdminTable {
  usersData: IUserDataForTable[];
  params: IUserDataForAdminTableParams;
}

export interface IUserDataForAdminTableResponse {
  status: number;
  data: IUserDataForAdminTable;
}

export interface IFiltersDataForAdminTableResponse {
  status: number;
  data: IFiltersDataForTable;
}
