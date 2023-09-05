import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { userBusinessData, userLocationData } from '../interfaces/interfaces';

export interface UserCreationAttributes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userBusiness: userBusinessData;
  userLocation: userLocationData;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
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

  @Column({ type: DataType.STRING, defaultValue: 'USER' })
  userRole: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isSuspended: boolean;

  @Column({ type: DataType.STRING, defaultValue: null })
  suspensionReason: string | null;

  @Column({ type: DataType.JSON })
  userBusiness: userBusinessData;

  @Column({ type: DataType.JSON })
  userLocation: userLocationData;
}
