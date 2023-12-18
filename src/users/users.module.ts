import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, UserStationRole } from './users.model';
import { Business } from 'src/businesses/businesses.model';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersParamsModule } from 'src/users_params/users_params.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Business, UserStationRole]),
    TokensModule,
    UsersParamsModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
