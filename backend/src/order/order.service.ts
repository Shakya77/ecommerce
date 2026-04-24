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
  PROMO_REPOSITORY,
} from '../../constants';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { ProductHasMedia } from 'src/product/entities/product-has-media.entity';
import { ProductHasCategory } from 'src/product/entities/product-has-category.entity';
import { Category } from 'src/category/entities/category.entity';
import { Roles, User } from 'src/users/entities/user.entity';
import { col, fn, Op } from 'sequelize';
import { Address } from 'src/address/entities/address.entity';
import { Promo } from 'src/promo/entities/promo.entity';

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
    @Inject(PROMO_REPOSITORY)
    private readonly promoRepository: typeof Promo,
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

      const cartIds = items.map((item) => Number(item?.cartId));

      const [updatedCartCount] = await this.cartRepository.update(
        { isActive: false },
        {
          where: {
            id: {
              [Op.in]: cartIds,
            },
            userId: user.id,
            isActive: true,
          },
          transaction,
        },
      );

      if (updatedCartCount === 0) {
        throw new BadRequestException('No matching active cart items found');
      }

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
    return await this.orderRepository.findAll({
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
                {
                  model: ProductHasCategory,
                  as: 'productCategories',
                  attributes: ['id', 'categoryId'],
                  include: [
                    {
                      model: Category,
                      as: 'category',
                      attributes: ['id', 'name', 'slug'],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: 'getUser',
          attributes: ['id', 'email', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number, user: { id: number; role: string }) {
    const where: any = { id };

    if (user.role !== Roles.ADMIN) {
      where.userId = user.id;
    }

    const order = await this.orderRepository.findOne({
      where,
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
                {
                  model: ProductHasCategory,
                  as: 'productCategories',
                  attributes: ['id', 'categoryId'],
                  include: [
                    {
                      model: Category,
                      as: 'category',
                      attributes: ['id', 'name', 'slug'],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: 'getUser',
          attributes: ['id', 'email', 'name'],
        },
        {
          model: Address,
          as: 'getAddress',
          attributes: ['id', 'address', 'city', 'state'],
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
    const order = await this.orderRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          attributes: ['quantity', 'price'],
        },
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const promoId = updateOrderDto.promoId;

    let discount = 0;
    let discountType = '';

    const orderItems = Array.isArray(order.orderItems) ? order.orderItems : [];

    const subTotal = orderItems.reduce((sum, item) => {
      const quantity = Number(item?.quantity || 0);
      const price = Number(item?.price || 0);
      return sum + quantity * price;
    }, 0);

    if (promoId) {
      const promo = await this.promoRepository.findOne({
        where: { id: promoId },
        attributes: ['id', 'title', 'promoType', 'code', 'value'],
      });

      if (!promo) {
        throw new BadRequestException('Promo not found');
      }

      discountType = promo.promoType;
      if (discountType === 'amount') {
        discount = promo.value;
      } else {
        discount = (subTotal * promo.value) / 100;
      }
    }

    const totalAmount = Math.max(subTotal - discount, 0);

    const [updatedCount] = await this.orderRepository.update(
      {
        ...updateOrderDto,
        status: 'COMPLETED',
        totalAmount,
        discountType,
      } as any as Order,
      {
        where: {
          id,
          userId: user.id,
        },
      },
    );

    return { message: 'Order Placed successfully', orderId: order.id };
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

  async totalRevenue() {
    const result = (await this.orderRepository.findOne({
      where: {
        status: 'COMPLETED',
      },
      attributes: [
        [fn('COALESCE', fn('SUM', col('totalAmount')), 0), 'totalRevenue'],
      ],
      raw: true,
    })) as { totalRevenue: number } | null;

    return {
      totalRevenue: Number(result?.totalRevenue),
    };
  }
}
