import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';
import { UsersParamsModule } from '../users_params/users_params.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { UsersStationsModule } from '../users_stations/users_stations.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    TokensModule,
    UsersParamsModule,
    BusinessesModule,
    UsersStationsModule,
    NotificationsModule,
  ],
})
export class AuthModule {}
