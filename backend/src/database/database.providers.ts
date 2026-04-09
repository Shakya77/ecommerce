import { Sequelize } from 'sequelize-typescript';
import { Category } from 'src/category/entities/category.entity';
import { ProductHasMedia } from 'src/product/entities/product-has-media.entity';
import { ProductHasCategory } from 'src/product/entities/product-has-category.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'ecommerce',
      });

      sequelize.addModels([
        User,
        Category,
        Product,
        ProductHasMedia,
        ProductHasCategory,
      ]);

      await sequelize.sync();
      return sequelize;
    },
  },
];
