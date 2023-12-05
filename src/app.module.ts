import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User, UserStationRole } from './users/users.model';
import { BusinessesModule } from './businesses/businesses.module';
import { Business } from './businesses/businesses.model';
import { StationsModule } from './stations/stations.module';
import { Station } from './stations/stations.model';
import { Account, StationAccount } from './accounts/accounts.model';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { Token } from './tokens/tokens.model';
import { Operation } from './operations/operations.model';
import { OperationsModule } from './operations/operations.module';
import { FuelPrice } from './fuel_prices/fuel_prices.model';
import { FuelPricesModule } from './fuel_prices/fuel_prices.module';
import { SupportModule } from './support/support.module';
import { Transaction } from './transactions/transactions.model';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersParamsModule } from './users_params/users_params.module';
import { UsersParams } from './users_params/users_params.model';
import { UserIdMiddleware } from './middleware/userId.middleware';
import { AccountsController } from './accounts/accounts.controller';
import { BusinessesController } from './businesses/businesses.controller';
import { FuelPricesController } from './fuel_prices/fuel_prices.controller';
import { OperationsController } from './operations/operations.controller';
import { StationsController } from './stations/stations.controller';
import { SupportController } from './support/support.controller';
import { TransactionsController } from './transactions/transactions.controller';

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
      models: [
        User,
        UserStationRole,
        UsersParams,
        Business,
        Station,
        Account,
        Token,
        StationAccount,
        Operation,
        FuelPrice,
        Transaction,
      ],
      autoLoadModels: true,
    }),
    UsersModule,
    BusinessesModule,
    StationsModule,
    AccountsModule,
    AuthModule,
    TokensModule,
    OperationsModule,
    FuelPricesModule,
    SupportModule,
    TransactionsModule,
    UsersParamsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdMiddleware)
      .exclude({ path: 'businesses', method: RequestMethod.POST })
      .forRoutes(
        AccountsController,
        BusinessesController,
        FuelPricesController,
        OperationsController,
        StationsController,
        SupportController,
        TransactionsController,
        { path: 'users/:id', method: RequestMethod.PUT },
        { path: 'users/admin/users-information', method: RequestMethod.GET },
        { path: 'users/:id', method: RequestMethod.DELETE },
      );
  }
}
