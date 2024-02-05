import { UsersStations } from '../users_stations/users_stations.model';
import { UsersParams } from '../users_params/users_params.model';
import { Business } from '../businesses/businesses.model';
import { UserTableColumns } from '../types/tableColumns';
import { Station } from '../stations/stations.model';
import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User, UserTableColumns> {
  @ForeignKey(() => Business)
  @Column({ type: DataType.INTEGER, allowNull: false })
  businessId: number;

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  lastName: string | null;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  password: string | null;

  @BelongsTo(() => Business)
  business: Business;

  @BelongsToMany(() => Station, () => UsersStations)
  stations: Station[];

  @HasOne(() => UsersParams)
  parameters: UsersParams;
}
