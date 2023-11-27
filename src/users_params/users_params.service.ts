import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersParams } from './users_params.model';
import { CreateUserParamsDto } from './dto/create-users_params.dto';

@Injectable()
export class UsersParamsService {
  constructor(
    @InjectModel(UsersParams)
    private usersParamsModel: typeof UsersParams,
  ) {}

  async createParamsForNewUser(params: CreateUserParamsDto) {
    const newUser: UsersParams = await this.usersParamsModel.create(params);
    return newUser;
  }
}
