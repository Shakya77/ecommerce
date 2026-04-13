import { Module } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CarouselController } from './carousel.controller';
import { carouselProviders } from './carousel.providers';

@Module({
  controllers: [CarouselController],
  providers: [CarouselService, ...carouselProviders],
})
export class CarouselModule {}
