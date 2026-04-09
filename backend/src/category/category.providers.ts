import { CATEGORIES_REPOSITORY } from '../../constants';
import { Category } from './entities/category.entity';

export const CategoryProviders = [
  {
    provide: CATEGORIES_REPOSITORY,
    useValue: Category,
  },
];
