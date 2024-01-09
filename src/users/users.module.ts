import { UsersStationsModule } from 'src/users_stations/users_stations.module';
import { UsersParamsModule } from 'src/users_params/users_params.module';
import { BusinessesModule } from 'src/businesses/businesses.module';
import { Business } from 'src/businesses/businesses.model';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { Module } from '@nestjs/common';
import { User } from './users.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Business]),
    TokensModule,
    UsersParamsModule,
    BusinessesModule,
    UsersStationsModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
