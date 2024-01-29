export interface IUserDataForGlobalSearch {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  stationAddress: string;
  stationName: string;
}

export interface IUsersParamsDataForGlobalSearch {
  amountOfUsers: number;
  amountOfPages: number;
  currentPage: number;
}

export interface IStationsDataForGlobalSearch {
  id: number;
  name: string;
  address: string;
  phone: string;
  openStatus?: true;
}

export interface IStationsParamsDataForGlobalSearch {
  amountOfStations: number;
  amountOfPages: number;
  currentPage: number;
}

export interface IGlobalSearchUsersData {
  users: IUserDataForGlobalSearch[];
  params: IUsersParamsDataForGlobalSearch;
}

export interface IGlobalSearchStationsData {
  stations: IStationsDataForGlobalSearch[];
  params: IStationsParamsDataForGlobalSearch;
}

export interface IGlobalSearchUsersResponse {
  status: number;
  data: IGlobalSearchUsersData;
}

export interface IGlobalSearchStationsResponse {
  status: number;
  data: IGlobalSearchStationsData;
}
