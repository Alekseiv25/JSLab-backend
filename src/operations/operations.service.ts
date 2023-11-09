import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Operation } from './operations.model';
import { InjectModel } from '@nestjs/sequelize';
import { IBasicOperationResponse, IGetAllOperationsResponse } from 'src/types/responses/operations';
import { makeNotFoundMessage } from 'src/utils/generators/messageGenerators';
import { CreateOperationDto } from './dto/create-operation.dto';

@Injectable()
export class OperationsService {
  constructor(@InjectModel(Operation) private operationRepository: typeof Operation) {}

  async getAllOperations(): Promise<IGetAllOperationsResponse> {
    const operations: Operation[] | [] = await this.operationRepository.findAll();
    if (operations.length === 0) {
      throw new HttpException(makeNotFoundMessage('Operations'), HttpStatus.NOT_FOUND);
    }
    const response: IGetAllOperationsResponse = { status: HttpStatus.OK, data: operations };
    return response;
  }

  async getOperationById(id: number): Promise<IBasicOperationResponse> {
    const operation: Operation | null = await this.operationRepository.findByPk(id);
    if (!operation) {
      throw new HttpException(makeNotFoundMessage('Operation'), HttpStatus.NOT_FOUND);
    }
    const response: IBasicOperationResponse = { status: HttpStatus.OK, data: operation };
    return response;
  }

  async createNewOperation(dto: CreateOperationDto): Promise<IBasicOperationResponse> {
    const newOperation: Operation = await this.operationRepository.create(dto);
    const response: IBasicOperationResponse = { status: HttpStatus.OK, data: newOperation };
    return response;
  }
}
