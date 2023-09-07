import { Column, DataType, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Business } from 'src/businesses/businesses.model';

export interface StationCreationAttributes {
  businessId: number;
  type: string;
  brand: string;
  name: string;
  adress: string;
  latitiud: number;
  longitude: number;
  phone: string;
  email: string;
  convenientStrore: boolean;
  groceries: boolean;
  alcohol: boolean;
  automotive: boolean;
  ice: boolean;
  tabacco: boolean;
  lottery: boolean;
  carWash: boolean;
  restrooms: boolean;
  ATM: boolean;
  foodOfferings: boolean;
  restaurant: boolean;
  overnightParking: boolean;
  showers: boolean;
}

@Table({ tableName: 'stations' })
export class Station extends Model<Station, StationCreationAttributes> {
  @ForeignKey(() => Business)
  @Column({ type: DataType.INTEGER, allowNull: false })
  businessId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  brand: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  adress: string;

  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  latitiud: number;

  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  longitude: number;

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  convenientStrore: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  groceries: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  alcohol: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  automotive: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  ice: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  tabacco: boolean;

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

  @BelongsTo(() => Business)
  owner: Business;
}
