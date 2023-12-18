import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from '../businesses/businesses.model';
import { Station } from '../stations/stations.model';
import { AccountTableColumns } from '../types/tableColumns';
import { Payment } from 'src/payments/payments.model';

@Table({ tableName: 'accounts' })
export class Account extends Model<Account, AccountTableColumns> {
  @ForeignKey(() => Business)
  @Column({ field: 'businessId', type: DataType.INTEGER, allowNull: false })
  businessId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  paymentMethod: string;

  @Column({ type: DataType.STRING, allowNull: false })
  verificationMethod: string;

  @Column({ type: DataType.STRING, allowNull: false })
  accountNickname: string;

  @Column({ type: DataType.STRING, allowNull: false })
  accountType: string;

  @Column({ type: DataType.STRING, allowNull: false })
  routingNumber: string;

  @Column({ type: DataType.STRING, allowNull: false })
  accountNumber: string;

  @BelongsToMany(() => Station, () => StationAccount)
  stations: Station[];

  @BelongsTo(() => Business, 'businessId')
  businesses: Business;

  @HasMany(() => Payment)
  payments: Payment[];
}

@Table({ tableName: 'station_accounts' })
export class StationAccount extends Model<StationAccount> {
  @ForeignKey(() => Station)
  @Column
  stationId: number;

  @ForeignKey(() => Account)
  @Column
  accountId: number;

  @BelongsTo(() => Station)
  station: Station;

  @BelongsTo(() => Account)
  account: Account;
}
