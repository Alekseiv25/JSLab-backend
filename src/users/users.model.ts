import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface UserCreationAttributes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  isAdmin?: boolean;
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

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isAdmin: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isSuspended: boolean;

  @Column({ type: DataType.STRING, defaultValue: null })
  suspensionReason: string | null;

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;
}
