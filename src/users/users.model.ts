import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  TableOptions,
  BelongsToMany,
} from 'sequelize-typescript';
import { Business } from 'src/businesses/businesses.model';
import { Station } from 'src/stations/stations.model';
import { UserTableColumns } from 'src/types/tableColumns';

@Table({ tableName: 'users' })
export class User extends Model<User, UserTableColumns> {
  @ForeignKey(() => Business)
  @Column({ type: DataType.INTEGER })
  businessId: number;

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, defaultValue: 'Active' })
  status: 'Invited' | 'Active' | 'Suspended';

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isAdmin: boolean;

  @Column({ type: DataType.STRING, defaultValue: null })
  suspensionReason: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isFinishedTutorial: boolean;

  @BelongsTo(() => Business)
  business: Business;

  @BelongsToMany(() => Station, () => UsersStations)
  stations: Station[];
}

@Table({ tableName: 'users_stations', timestamps: false } as TableOptions)
export class UsersStations extends Model<UsersStations> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Station)
  @Column
  stationId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Station)
  station: Station;
}
