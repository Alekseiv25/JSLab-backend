import { TokenTableColumns } from 'src/types/tableColumns';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'tokens' })
export class Token extends Model<Token, TokenTableColumns> {
  @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  refreshToken: string;
}
