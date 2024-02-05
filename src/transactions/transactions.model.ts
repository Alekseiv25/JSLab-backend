import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Business } from '../businesses/businesses.model';
import { Station } from '../stations/stations.model';
import { TransactionsColumns } from '../types/tableColumns';

@Table({ tableName: 'transactions' })
export class Transaction extends Model<Transaction, TransactionsColumns> {
  @ForeignKey(() => Station)
  @Column({ field: 'stationId', type: DataType.INTEGER, allowNull: false })
  stationId: number;
  @ForeignKey(() => Business)
  @Column({ field: 'businessId', type: DataType.INTEGER, allowNull: false })
  businessId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  customerName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  fuelType: string;

  @Column({ type: DataType.STRING, allowNull: false })
  rate: string;

  @Column({ type: DataType.STRING, allowNull: false })
  costs: string;

  @Column({ type: DataType.STRING, allowNull: false })
  discount: string;

  @Column({ type: DataType.STRING, allowNull: false })
  amount: string;

  @BelongsTo(() => Station, 'stationId')
  stations: Station;

  @BelongsTo(() => Business, 'businessId')
  businesses: Business;
}
