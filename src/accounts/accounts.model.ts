import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Station } from 'src/stations/stations.model';

export interface AccountCreationAttributes {
  paymentMethod: string;
  verificationMethod: string;
  accountNickname: string;
  accountType: string;
  routingNumber: string;
  accountNumber: string;
}

@Table({ tableName: 'accounts' })
export class Account extends Model<Account, AccountCreationAttributes> {
  @ForeignKey(() => Station)
  @Column({ type: DataType.INTEGER })
  StationId: number;
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
