import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Station } from 'src/stations/stations.model';
import { FuelPricesColumns } from 'src/types/tableColumns';

@Table({ tableName: 'fuel_prices' })
export class FuelPrice extends Model<FuelPrice, FuelPricesColumns> {
  @ForeignKey(() => Station)
  @Column({ field: 'stationId', type: DataType.INTEGER, allowNull: false })
  stationId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  fuelType: string;

  @Column({ type: DataType.STRING, allowNull: false })
  grade: string;

  @Column({ type: DataType.STRING, allowNull: false })
  displayName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  rate: string;

  @Column({ type: DataType.STRING, allowNull: false })
  price: string;

  @Column({ type: DataType.STRING, allowNull: false })
  minDiscount: string;

  @Column({ type: DataType.STRING, allowNull: false })
  maxDiscount: string;

  @BelongsTo(() => Station, 'stationId')
  stations: Station;
}
