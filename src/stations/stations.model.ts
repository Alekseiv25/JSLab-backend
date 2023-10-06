import { Account } from 'src/accounts/accounts.model';
import { Business } from 'src/businesses/businesses.model';
import { StationTableColumns } from 'src/types/tableColumns';
import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';

@Table({ tableName: 'stations' })
export class Station extends Model<Station, StationTableColumns> {
  @ForeignKey(() => Business)
  @Column({ type: DataType.INTEGER, allowNull: false })
  businessId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  brand: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lat: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lng: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  convenientStore: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  groceries: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  alcohol: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  automotive: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  ice: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  tobacco: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  lottery: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  carWash: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  restrooms: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  ATM: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  foodOfferings: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  restaurant: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  overnightParking: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  showers: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  POS: string;

  @BelongsTo(() => Business)
  owner: Business;

  @HasMany(() => Account)
  accounts: Account;
}
