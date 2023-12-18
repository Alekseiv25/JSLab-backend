import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Account } from 'src/accounts/accounts.model';
import { Payment } from 'src/payments/payments.model';
import { Station } from 'src/stations/stations.model';
import { Transaction } from 'src/transactions/transactions.model';
import { BusinessTableColumns } from 'src/types/tableColumns';
import { User } from 'src/users/users.model';

@Table({ tableName: 'businesses' })
export class Business extends Model<Business, BusinessTableColumns> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  legalName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  yearsOfOperation: string;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  streetAddress: string;

  @Column({ type: DataType.STRING })
  secondaryAddress: string;

  @Column({ type: DataType.STRING, allowNull: false })
  city: string;

  @Column({ type: DataType.STRING, allowNull: false })
  ST: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  zip: number;

  @HasMany(() => User)
  users: User[];

  @HasMany(() => Station)
  stations: Station[];

  @HasMany(() => Account)
  accounts: Account[];

  @HasMany(() => Transaction)
  transactions: Transaction[];

  @HasMany(() => Payment)
  payments: Payment[];
}
