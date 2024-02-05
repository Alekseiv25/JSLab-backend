import { UserStationRoleTypes } from '../types/tableColumns';
import { Station } from '../stations/stations.model';
import { User } from '../users/users.model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  TableOptions,
} from 'sequelize-typescript';

@Table({ tableName: 'users_stations', timestamps: false } as TableOptions)
export class UsersStations extends Model<UsersStations> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Station)
  @Column
  stationId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  role: UserStationRoleTypes;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Station)
  station: Station;
}
