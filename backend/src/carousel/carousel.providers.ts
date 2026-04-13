import { Carousel } from './entities/carousel.entity';
import { CAROUSEL_REPOSITORY } from '../../constants';

export const carouselProviders = [
  {
    provide: CAROUSEL_REPOSITORY,
    useValue: Carousel,
  },
];
