import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Station } from 'src/stations/stations.model';
import { OperationTableColumns } from 'src/types/tableColumns';

@Table({ tableName: 'operations_hours' })
export class Operation extends Model<Operation, OperationTableColumns> {
  @ForeignKey(() => Station)
  stationId: number;

  @Column({ type: DataType.STRING })
  day: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isOpen: boolean;

  @Column({ type: DataType.STRING })
  timeFrom: string;

  @Column({ type: DataType.STRING })
  timeTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isBreak: boolean;

  @Column({ type: DataType.STRING })
  timeBreakFrom: string;

  @Column({ type: DataType.STRING })
  timeBreakTo: string;

  @BelongsTo(() => Station)
  station: Station;
}
