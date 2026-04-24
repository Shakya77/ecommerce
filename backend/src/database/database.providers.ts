import { Sequelize } from 'sequelize-typescript';
import { Category } from 'src/category/entities/category.entity';
import { ProductHasMedia } from 'src/product/entities/product-has-media.entity';
import { ProductHasCategory } from 'src/product/entities/product-has-category.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Carousel } from 'src/carousel/entities/carousel.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { Address } from 'src/address/entities/address.entity';
import { Promo } from 'src/promo/entities/promo.entity';

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
        Carousel,
        Cart,
        Wishlist,
        Order,
        OrderItem,
        Address,
        Promo,
      ]);

      await sequelize.sync();
      return sequelize;
    },
  },
];
