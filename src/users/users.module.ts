import { UsersStationsModule } from '../users_stations/users_stations.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersParamsModule } from '../users_params/users_params.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { TokensModule } from '../tokens/tokens.module';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { Module } from '@nestjs/common';
import { User } from './users.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User]),
    TokensModule,
    UsersParamsModule,
    BusinessesModule,
    UsersStationsModule,
    NotificationsModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
