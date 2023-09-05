import { Column, DataType, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/users/users.model';

export interface BusinessCreationAttributes {
  legalName: string;
  yearsOfOperation: string;
  type: string;
  streetAdress: string;
  secondaryAdress: string;
  city: string;
  ST: string;
  zip: number;
}

@Table({ tableName: 'businesses' })
export class Business extends Model<Business, BusinessCreationAttributes> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  legalName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  yearsOfOperation: string;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  streetAdress: string;

  @Column({ type: DataType.STRING })
  secondaryAdress: string;

  @Column({ type: DataType.STRING, allowNull: false })
  city: string;

  @Column({ type: DataType.STRING, allowNull: false })
  ST: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  zip: number;

  @BelongsTo(() => User)
  owner: User;
}
