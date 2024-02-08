import { UsersParamsModule } from '../users_params/users_params.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PusherService } from '../pusher/pusher.service';
import { TokensModule } from '../tokens/tokens.module';
import { Notification } from './notifications.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PusherService],
  imports: [SequelizeModule.forFeature([Notification]), TokensModule, UsersParamsModule],
  exports: [NotificationsService],
})
export class NotificationsModule {}
