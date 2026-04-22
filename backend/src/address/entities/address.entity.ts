import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'addresses',
  paranoid: true,
})
export class Address extends Model<Address> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  state: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;
}
