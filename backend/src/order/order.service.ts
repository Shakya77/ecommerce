import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { ProductHasMedia } from 'src/product/entities/product-has-media.entity';

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
      throw new BadRequestException('No items provided');
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
          throw new BadRequestException(`Product with id ${item.id} not found`);
        }

        if (!item.quantity || item.quantity <= 0) {
          throw new BadRequestException('Invalid quantity for order item');
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

  async findAll(user: { id: number }) {
    return await this.orderRepository.findAll({
      where: {
        userId: user.id,
        isActive: true,
      },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'getProduct',
              attributes: ['id', 'name', 'slug', 'price'],
              include: [
                {
                  model: ProductHasMedia,
                  as: 'medias',
                  attributes: ['id', 'path', 'filename', 'type', 'size'],
                },
              ],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number, user: { id: number }) {
    const order = await this.orderRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'getProduct',
              attributes: ['id', 'name', 'slug', 'price'],
              include: [
                {
                  model: ProductHasMedia,
                  as: 'medias',
                  attributes: ['id', 'path', 'filename', 'type', 'size'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
    user: { id: number },
  ) {
    const [updatedCount] = await this.orderRepository.update(
      updateOrderDto as any as Order,
      {
        where: {
          id,
          userId: user.id,
        },
      },
    );

    if (!updatedCount) {
      throw new NotFoundException('Order not found');
    }

    return { message: 'Order updated successfully' };
  }

  async remove(id: number, user: { id: number }) {
    const deletedCount = await this.orderRepository.destroy({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!deletedCount) {
      throw new NotFoundException('Order not found');
    }

    return { message: 'Order removed successfully' };
  }
}
