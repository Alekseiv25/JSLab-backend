import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, UserStationRole } from './users.model';
import { Business } from 'src/businesses/businesses.model';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersParamsModule } from 'src/users_params/users_params.module';
import { BusinessesModule } from 'src/businesses/businesses.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Business, UserStationRole]),
    TokensModule,
    UsersParamsModule,
    BusinessesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
