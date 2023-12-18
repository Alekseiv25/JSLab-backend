import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Account } from 'src/accounts/accounts.model';
import { Business } from 'src/businesses/businesses.model';
import { Station } from 'src/stations/stations.model';
import { PaymentsColumns } from 'src/types/tableColumns';

@Table({ tableName: 'payments' })
export class Payment extends Model<Payment, PaymentsColumns> {
  @ForeignKey(() => Station)
  @Column({ field: 'stationId', type: DataType.INTEGER, allowNull: false })
  stationId: number;

  @ForeignKey(() => Business)
  @Column({ field: 'businessId', type: DataType.INTEGER, allowNull: false })
  businessId: number;

  @ForeignKey(() => Account)
  @Column({ field: 'accountId', type: DataType.INTEGER, allowNull: false })
  accountId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  paymentName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  paymentAmount: string;

  @BelongsTo(() => Station, 'stationId')
  stations: Station;

  @BelongsTo(() => Business, 'businessId')
  businesses: Business;

  @BelongsTo(() => Account, 'accountId')
  accounts: Account;
}
