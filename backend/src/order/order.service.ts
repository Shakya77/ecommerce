import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import {
  ORDER_REPOSITORY,
  ORDER_ITEM_REPOSITORY,
  PRODUCTS_REPOSITORY,
  CARTS_REPOSITORY,
} from '../../constants';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { Cart } from 'src/cart/entities/cart.entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: typeof Order,
    @Inject(ORDER_ITEM_REPOSITORY)
    private readonly orderItemRepository: typeof OrderItem,
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: typeof Product,
    @Inject(CARTS_REPOSITORY)
    private readonly cartRepository: typeof Cart,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: { id: number }) {
    const { items } = createOrderDto;

    if (!items || items.length === 0) {
      throw new Error('No items provided');
    }

    const transaction = await this.orderRepository.sequelize!.transaction();

    try {
      const order = await this.orderRepository.create(
        {
          userId: user.id,
          status: 'PENDING',
        } as any as Order,
        { transaction },
      );

      const productIds = items.map((item) => item.id);

      const products = await this.productsRepository.findAll({
        where: { id: productIds },
        transaction,
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      const orderItemsData = items.map((item) => {
        const product = productMap.get(item.id);

        if (!product) {
          throw new Error(`Product with id ${item.id} not found`);
        }

        return {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        };
      });

      await this.orderItemRepository.bulkCreate(
        orderItemsData as any as OrderItem[],
        {
          transaction,
        },
      );

      const cartIds = items.map((item) => item.cartId);

      await this.cartRepository.update(
        { isActive: false },
        {
          where: {
            id: cartIds,
            userId: user.id,
          },
          transaction,
        },
      );

      await transaction.commit();

      return {
        message: 'Order created successfully',
        orderId: order.id,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll() {
    return await this.orderRepository.findAll();
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({ where: { id } });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.orderRepository.update(updateOrderDto as any as Order, {
      where: { id },
    });
  }

  async remove(id: number) {
    return await this.orderRepository.destroy({ where: { id } });
  }
}
