import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersParamsModule } from 'src/users_params/users_params.module';
import { BusinessesModule } from 'src/businesses/businesses.module';
import { UsersStationsModule } from 'src/users_stations/users_stations.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

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
