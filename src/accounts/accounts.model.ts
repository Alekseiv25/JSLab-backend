import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Business } from '../businesses/businesses.model';
import { Station } from '../stations/stations.model';
import { AccountTableColumns } from '../types/tableColumns';

@Table({ tableName: 'accounts' })
export class Account extends Model<Account, AccountTableColumns> {
  @ForeignKey(() => Station)
  @Column({ field: 'stationId', type: DataType.INTEGER, allowNull: false })
  stationId: number;
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

  @BelongsTo(() => Station, 'stationId')
  stations: Station;

  @BelongsTo(() => Business, 'businessId')
  businesses: Business;
}
