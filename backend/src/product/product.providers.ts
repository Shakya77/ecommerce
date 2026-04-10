import {
  PRODUCT_HAS_CATEGORY_REPOSITORY,
  PRODUCT_HAS_MEDIA_REPOSITORY,
  PRODUCTS_REPOSITORY,
} from '../../constants';
import { ProductHasCategory } from './entities/product-has-category.entity';
import { ProductHasMedia } from './entities/product-has-media.entity';
import { Product } from './entities/product.entity';

export const productProviders = [
  {
    provide: PRODUCTS_REPOSITORY,
    useValue: Product,
  },
  {
    provide: PRODUCT_HAS_CATEGORY_REPOSITORY,
    useValue: ProductHasCategory,
  },
  {
    provide: PRODUCT_HAS_MEDIA_REPOSITORY,
    useValue: ProductHasMedia,
  },
];
