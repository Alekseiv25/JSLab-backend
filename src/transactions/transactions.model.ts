import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Station } from 'src/stations/stations.model';
import { TransactionsColumns } from 'src/types/tableColumns';

@Table({ tableName: 'transactions' })
export class Transaction extends Model<Transaction, TransactionsColumns> {
  @ForeignKey(() => Station)
  @Column({ field: 'stationId', type: DataType.INTEGER, allowNull: false })
  stationId: number;

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
}
