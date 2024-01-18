import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokensModule } from 'src/tokens/tokens.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './payments.model';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { StationsModule } from 'src/stations/stations.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [
    SequelizeModule.forFeature([Payment]),
    TokensModule,
    NotificationsModule,
    StationsModule,
    UsersModule,
  ],
})
export class PaymentsModule {}
