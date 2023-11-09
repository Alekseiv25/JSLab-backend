import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { OperationTableColumns } from 'src/types/tableColumns';

@Table({ tableName: 'operations_hours' })
export class Operation extends Model<Operation, OperationTableColumns> {
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  sunday: boolean;

  @Column({ type: DataType.STRING })
  sundayFrom: string;

  @Column({ type: DataType.STRING })
  sundayTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  sundayBreakClosed: boolean;

  @Column({ type: DataType.STRING })
  sundayBreakFrom: string;

  @Column({ type: DataType.STRING })
  sundayBreakTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  monday: boolean;

  @Column({ type: DataType.STRING })
  mondayFrom: string;

  @Column({ type: DataType.STRING })
  mondayTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  mondayBreakClosed: boolean;

  @Column({ type: DataType.STRING })
  mondayBreakFrom: string;

  @Column({ type: DataType.STRING })
  mondayBreakTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  tuesday: boolean;

  @Column({ type: DataType.STRING })
  tuesdayFrom: string;

  @Column({ type: DataType.STRING })
  tuesdayTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  tuesdayBreakClosed: boolean;

  @Column({ type: DataType.STRING })
  tuesdayBreakFrom: string;

  @Column({ type: DataType.STRING })
  tuesdayBreakTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  wednesday: boolean;

  @Column({ type: DataType.STRING })
  wednesdayFrom: string;

  @Column({ type: DataType.STRING })
  wednesdayTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  wednesDayBreakClosed: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  wednesdayBreakFrom: boolean;

  @Column({ type: DataType.STRING })
  wednesdayBreakTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  thursday: boolean;

  @Column({ type: DataType.STRING })
  thursdayFrom: string;

  @Column({ type: DataType.STRING })
  thursdayTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  thursdayBreakClosed: boolean;

  @Column({ type: DataType.STRING })
  thursdayBreakFrom: string;

  @Column({ type: DataType.STRING })
  thursdayBreakTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  friday: boolean;

  @Column({ type: DataType.STRING })
  fridayFrom: string;

  @Column({ type: DataType.STRING })
  fridayTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  fridayBreakClosed: boolean;

  @Column({ type: DataType.STRING })
  fridayBreakFrom: string;

  @Column({ type: DataType.STRING })
  fridayBreakTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  saturday: boolean;

  @Column({ type: DataType.STRING })
  saturdayFrom: string;

  @Column({ type: DataType.STRING })
  saturdayTo: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  saturdayBreakClosed: boolean;

  @Column({ type: DataType.STRING })
  saturdayBreakFrom: string;

  @Column({ type: DataType.STRING })
  saturdayBreakTo: string;
}
