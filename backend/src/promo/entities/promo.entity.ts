import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Order } from 'src/order/entities/order.entity';

export enum PromoType {
  AMOUNT = 'amount',
  PERCENTAGE = 'percentage',
}

export enum PromoScheduleType {
  FIXED = 'fixed',
  ALWAYS = 'always',
}

@Table({
  tableName: 'promos',
  paranoid: true,
})
export class Promo extends Model<Promo> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.ENUM(...Object.values(PromoType)),
    allowNull: false,
  })
  promoType: PromoType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  code: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  value: number;

  @HasMany(() => Order)
  getOrders: Order[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(PromoScheduleType)),
    allowNull: true,
    defaultValue: PromoScheduleType.ALWAYS,
  })
  scheduleType: PromoScheduleType;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate: Date;
}
