import { Business } from 'src/businesses/businesses.model';
import { Station } from 'src/stations/stations.model';
import { UserTableColumns } from 'src/types/tableColumns';
import { UsersParams } from 'src/users_params/users_params.model';
import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  TableOptions,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
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

  @BelongsTo(() => Business)
  business: Business;

  @BelongsToMany(() => Station, () => UsersStations)
  stations: Station[];

  @HasOne(() => UsersParams)
  parameters: UsersParams;
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
