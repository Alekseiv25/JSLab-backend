import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './tokens.model';
import { UsersParamsModule } from '../users_params/users_params.module';

@Module({
  providers: [TokensService],
  imports: [SequelizeModule.forFeature([Token]), UsersParamsModule],
  exports: [TokensService],
})
export class TokensModule {}
