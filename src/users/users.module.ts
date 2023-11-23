import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, UsersStations } from './users.model';
import { Business } from 'src/businesses/businesses.model';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User, Business, UsersStations]), TokensModule],
  exports: [UsersService],
})
export class UsersModule {}
