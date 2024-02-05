import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
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
import { Payment } from './payments/payments.model';
import { PaymentsModule } from './payments/payments.module';
import { SocketService } from './socket/socket.service';
import { UsersStations } from './users_stations/users_stations.model';
import { UsersStationsModule } from './users_stations/users_stations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/notifications.model';

@Module({
  controllers: [],
  providers: [SocketService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      dialectModule: require('pg'),
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
        },
      },
      models: [
        User,
        UsersStations,
        UsersParams,
        Business,
        Station,
        Account,
        Token,
        StationAccount,
        Operation,
        FuelPrice,
        Transaction,
        Payment,
        Notification,
      ],
      autoLoadModels: true,
    }),
    UsersModule,
    UsersStationsModule,
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
    PaymentsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
