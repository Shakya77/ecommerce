import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Address } from 'src/address/entities/address.entity';
import { Promo, PromoType } from 'src/promo/entities/promo.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Table({
  tableName: 'orders',
  paranoid: true,
})
export class Order extends Model<Order> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  getUser: User;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
    defaultValue: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];

  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  addressId: number;

  @BelongsTo(() => Address)
  getAddress: Address;

  @ForeignKey(() => Promo)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  promoId: number;

  @BelongsTo(() => Promo)
  getPromo: Promo;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  subTotal: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  discount: number;

  @Column({
    type: DataType.ENUM(...Object.values(PromoType)),
    allowNull: true,
  })
  discountType: PromoType;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  totalAmount: number;
}
