import { UsersParamsModule } from 'src/users_params/users_params.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SocketService } from 'src/socket/socket.service';
import { TokensModule } from 'src/tokens/tokens.module';
import { Notification } from './notifications.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, SocketService],
  imports: [SequelizeModule.forFeature([Notification]), TokensModule, UsersParamsModule],
  exports: [NotificationsService],
})
export class NotificationsModule {}
