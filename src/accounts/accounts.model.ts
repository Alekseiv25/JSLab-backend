import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Station } from 'src/stations/stations.model';
import { AccountTableColumns } from 'src/types/tableColumns';

@Table({ tableName: 'accounts' })
export class Account extends Model<Account, AccountTableColumns> {
  @ForeignKey(() => Station)
  @Column({ type: DataType.INTEGER, allowNull: false })
  stationId: number;

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

  @BelongsTo(() => Station)
  stations: Station;
}
