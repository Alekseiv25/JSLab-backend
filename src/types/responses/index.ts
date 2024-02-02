export interface IBasicResponse {
  status: number;
  message: string;
}

export interface IPaginationParams {
  totalCount?: number;
  amountOfPages?: number;
  currentPage?: number;
}
