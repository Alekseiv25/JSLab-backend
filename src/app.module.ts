import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { BusinessesModule } from './businesses/businesses.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DB,
      models: [User],
      autoLoadModels: true,
    }),
    UsersModule,
    BusinessesModule,
  ],
})
export class AppModule {}
