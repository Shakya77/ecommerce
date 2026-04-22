import { ADDRESS_REPOSITORY } from '../../constants';
import { Address } from './entities/address.entity';

export const addressProviders = [
  {
    provide: ADDRESS_REPOSITORY,
    useValue: Address,
  },
];
