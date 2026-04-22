import { DataTypes } from 'sequelize';
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ProductHasMedia } from './product-has-media.entity';
import { ProductHasCategory } from './product-has-category.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';

@Table({
  tableName: 'products',
  paranoid: true,
})
export class Product extends Model<Product> {
  @PrimaryKey
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  slug: string;

  @Column({
    type: DataTypes.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;

  @HasMany(() => ProductHasCategory)
  productCategories: ProductHasCategory[];

  @HasMany(() => ProductHasMedia)
  medias: ProductHasMedia[];

  @HasMany(() => Wishlist)
  wishlists: Wishlist[];

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];
}
