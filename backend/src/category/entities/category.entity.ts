import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  BelongsToMany,
  Column,
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

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  createdBy: number;

  @BelongsTo(() => User)
  getCreatedBy: User;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
  })
  updatedBy: number;

  @BelongsTo(() => User)
  getUpdatedBy: User;

  @BelongsToMany(() => Product, () => ProductHasCategory)
  products: Product[];
}
