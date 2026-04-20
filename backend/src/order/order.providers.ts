import { ORDER_REPOSITORY, ORDER_ITEM_REPOSITORY } from '../../constants';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

export const orderProviders = [
  {
    provide: ORDER_REPOSITORY,
    useValue: Order,
  },
];

export const orderItemProviders = [
  {
    provide: ORDER_ITEM_REPOSITORY,
    useValue: OrderItem,
  },
];
