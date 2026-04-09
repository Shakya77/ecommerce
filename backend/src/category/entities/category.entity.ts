import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ProductHasCategory } from 'src/product/entities/product-has-category.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Table({
  tableName: 'categories',
  paranoid: true,
})
export class Category extends Model<Category> {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdBy: number;

  @BelongsTo(() => User)
  getCreatedBy: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  updatedBy: number;

  @BelongsTo(() => User)
  getUpdatedBy: User;

  @BelongsToMany(() => Product, () => ProductHasCategory)
  products: Product[];
}
