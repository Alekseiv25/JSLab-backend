import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateValueExeption extends HttpException {
  constructor(message: string) {
    super(`${message} - is not unique!`, HttpStatus.BAD_REQUEST);
  }
}

export class UniqueValueExeption extends HttpException {
  constructor(message: string) {
    super(`${message} - is unique!`, HttpStatus.OK);
  }
}
