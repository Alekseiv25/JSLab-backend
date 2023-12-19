import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { makeNotFoundMessage } from 'src/utils/generators/messageGenerators';
import { CreateUserParamsDto } from './dto/create-users_params.dto';
import { UsersParams } from './users_params.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersParamsService {
  constructor(
    @InjectModel(UsersParams)
    private usersParamsModel: typeof UsersParams,
  ) {}

  async getUserParams(userId: number): Promise<UsersParams> {
    const userParams: UsersParams = await this.findUserParamsByID(userId);
    return userParams;
  }

  async getUserParamsByInviteLink(inviteLink: string): Promise<UsersParams> {
    const userParams: UsersParams = await this.findUserParamsByInviteLink(inviteLink);
    return userParams;
  }

  async createParamsForNewUser(params: CreateUserParamsDto): Promise<UsersParams> {
    const newUser: UsersParams = await this.usersParamsModel.create(params);
    return newUser;
  }

  async updateUserParams(
    userId: number,
    newUserParams: Partial<CreateUserParamsDto>,
  ): Promise<UsersParams> {
    const userParams: UsersParams = await this.findUserParamsByID(userId);

    if (newUserParams.status) {
      const currentTimestamp: string = await this.getCurrentTimestamp();
      const updatedUserParams: UsersParams = await userParams.update({
        ...newUserParams,
        statusChangeDate: currentTimestamp,
      });
      return updatedUserParams;
    }

    const updatedUserParams: UsersParams = await userParams.update({ ...newUserParams });
    return updatedUserParams;
  }

  async updateUserLastActivityTimestamp(userId: number): Promise<void> {
    const userParams: UsersParams = await this.findUserParamsByID(userId);
    const currentTimestamp: string = await this.getCurrentTimestamp();
    await userParams.update({ lastActivityDate: currentTimestamp });
  }

  private async findUserParamsByID(userId: number): Promise<UsersParams> {
    const userParams: UsersParams = await this.usersParamsModel.findByPk(userId);

    if (!userParams) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    return userParams;
  }

  private async findUserParamsByInviteLink(inviteLink: string): Promise<UsersParams> {
    const userParams: UsersParams | null = await this.usersParamsModel.findOne({
      where: { inviteLink: inviteLink },
    });

    if (!userParams) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    return userParams;
  }

  private async getCurrentTimestamp(): Promise<string> {
    const currentTimestamp: string = String(new Date().getTime());
    return currentTimestamp;
  }
}
