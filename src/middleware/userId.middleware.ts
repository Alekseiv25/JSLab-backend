import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersParamsService } from 'src/users_params/users_params.service';

@Injectable()
export class UserIdMiddleware implements NestMiddleware {
  constructor(private userParamsService: UsersParamsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['user-id'];
    this.userParamsService.updateUserLastActivityTimestamp(+userId);

    next();
  }
}
