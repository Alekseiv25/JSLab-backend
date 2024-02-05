import { Operation } from '../../../operations/operations.model';

export interface IGetAllOperationsResponse {
  status: number;
  data: Operation[];
}

export interface IBasicOperationResponse {
  status: number;
  data: Operation;
}
