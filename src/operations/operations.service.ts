import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Operation } from './operations.model';
import { InjectModel } from '@nestjs/sequelize';
import { IBasicOperationResponse, IGetAllOperationsResponse } from 'src/types/responses/operations';
import { makeNotFoundMessage } from 'src/utils/generators/messageGenerators';
import { CreateOperationDto } from './dto/create-operation.dto';
import { Op } from 'sequelize';

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

  async getOperationsByStationId(stationId: number): Promise<IGetAllOperationsResponse> {
    const operations: Operation[] | null = await this.operationRepository.findAll({
      where: {
        stationId: {
          [Op.in]: [stationId],
        },
      },
    });

    if (operations.length === 0) {
      throw new HttpException(makeNotFoundMessage('Operations'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllOperationsResponse = { status: HttpStatus.OK, data: operations };
    return response;
  }

  async createNewOperation(stationId: number): Promise<Operation[]> {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const operations: Operation[] = [];

    for (const day of days) {
      const newOperationDto: CreateOperationDto = {
        day,
        isOpen: false,
        timeFrom: '0.00 AM',
        timeTo: '0.00 AM',
        isBreak: false,
        timeBreakFrom: '0.00 AM',
        timeBreakTo: '0.00 AM',
        stationId,
      };

      const newOperation: Operation = await this.operationRepository.create(newOperationDto);
      operations.push(newOperation);
    }

    return operations;
  }

  async updateOperation(id: number, dto: CreateOperationDto): Promise<IBasicOperationResponse> {
    const operation: Operation | null = await this.operationRepository.findOne({ where: { id } });

    if (!operation) {
      throw new HttpException(makeNotFoundMessage('Operation'), HttpStatus.NOT_FOUND);
    }

    const updatedOperation: Operation = await operation.update(dto);
    const response: IBasicOperationResponse = { status: HttpStatus.OK, data: updatedOperation };
    return response;
  }
}
