import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.model';

@Table({ tableName: 'notifications', timestamps: false })
export class Notification extends Model<Notification> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  message: string;

  @Column({ type: DataType.STRING, allowNull: false })
  createdAt: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  isViewed: boolean;
}
