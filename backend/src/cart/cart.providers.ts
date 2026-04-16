import { CARTS_REPOSITORY } from '../../constants';
import { CartService } from './cart.service';

export const CartProviders = [
  {
    provide: CARTS_REPOSITORY,
    useValue: CartService,
  },
];
