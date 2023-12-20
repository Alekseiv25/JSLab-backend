import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserStatusTypes, UsersParamsTableColumns } from 'src/types/tableColumns';
import { User } from 'src/users/users.model';

@Table({ tableName: 'users_params', timestamps: false })
export class UsersParams extends Model<UsersParams, UsersParamsTableColumns> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  status: UserStatusTypes;

  @Column({ type: DataType.STRING, allowNull: false })
  statusChangeDate: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isBusinessAdmin: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isFinishedTutorial: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  lastActivityDate: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  inviteLink: string;
}
