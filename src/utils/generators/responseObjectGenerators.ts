import { HttpStatus } from '@nestjs/common';
import { IBasicResponse } from 'src/types/responses';

export function generateNotFoundResponse(name: string): IBasicResponse {
  const response: IBasicResponse = {
    statusCode: HttpStatus.NOT_FOUND,
    message: `${name} was not found in the database!`,
  };
  return response;
}

export function generateConflictResponse(name: string): IBasicResponse {
  const response: IBasicResponse = {
    statusCode: HttpStatus.CONFLICT,
    message: `${name} is already in use. Please choose a different one.`,
  };
  return response;
}

export function generateAvailableResponse(name: string): IBasicResponse {
  const response: IBasicResponse = {
    statusCode: HttpStatus.OK,
    message: `${name} is available for registration.`,
  };
  return response;
}
