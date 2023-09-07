import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateValueExeption extends HttpException {
  constructor(message: string) {
    super(`Value: ${message} - is not unique!`, HttpStatus.BAD_REQUEST);
  }
}
