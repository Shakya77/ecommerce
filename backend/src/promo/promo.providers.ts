import { PROMO_REPOSITORY } from '../../constants';
import { Promo } from './entities/promo.entity';

export const promoProviders = [
  {
    provide: PROMO_REPOSITORY,
    useValue: Promo,
  },
];
