import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Business } from 'src/businesses/businesses.model';

export interface UserCreationAttributes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  isAdmin?: boolean;
  businessId?: number | null;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
  @ForeignKey(() => Business)
  @Column({ type: DataType.INTEGER })
  businessId: number;

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isAdmin: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isSuspended: boolean;

  @Column({ type: DataType.STRING, defaultValue: null })
  suspensionReason: string | null;

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @BelongsTo(() => Business)
  business: Business;
}
