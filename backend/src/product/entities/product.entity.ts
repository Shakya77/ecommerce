import { DataTypes } from 'sequelize';
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/category/entities/category.entity';
import { ProductHasMedia } from './product-has-media.entity';
import { ProductHasCategory } from './product-has-category.entity';

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
    type: DataTypes.STRING,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;

  @BelongsToMany(() => Category, () => ProductHasCategory)
  categories: Category[];

  @HasMany(() => ProductHasMedia)
  medias: ProductHasMedia[];
}
