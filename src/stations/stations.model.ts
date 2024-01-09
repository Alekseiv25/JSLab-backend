import { Account, StationAccount } from 'src/accounts/accounts.model';
import { Business } from 'src/businesses/businesses.model';
import { StationTableColumns } from 'src/types/tableColumns';
import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Operation } from 'src/operations/operations.model';
import { FuelPrice } from 'src/fuel_prices/fuel_prices.model';
import { Transaction } from 'src/transactions/transactions.model';
import { Payment } from 'src/payments/payments.model';
import { User } from 'src/users/users.model';
import { UsersStations } from 'src/users_stations/users_stations.model';

@Table({ tableName: 'stations' })
export class Station extends Model<Station, StationTableColumns> {
  @ForeignKey(() => Business)
  @Column({ type: DataType.INTEGER, allowNull: false })
  businessId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  brand: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING })
  imageUrl: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lat: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lng: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  convenientStore: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  groceries: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  alcohol: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  automotive: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  ice: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  tobacco: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  lottery: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  carWash: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  restrooms: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  ATM: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  foodOfferings: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  restaurant: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  overnightParking: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  showers: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  POS: string;

  @Column({ type: DataType.STRING, defaultValue: null })
  merchantId: string;

  @Column({ type: DataType.STRING, defaultValue: null })
  storeId: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isOnline: boolean;

  @BelongsTo(() => Business)
  owner: Business;

  @BelongsToMany(() => User, () => UsersStations)
  users: User[];

  @BelongsToMany(() => Account, () => StationAccount)
  accounts: Account[];

  @HasMany(() => Transaction)
  transactions: Transaction[];

  @HasMany(() => Operation)
  operations: Operation[];

  @HasMany(() => FuelPrice)
  fuelPrices: FuelPrice[];

  @HasMany(() => Payment)
  payments: Payment[];
}
