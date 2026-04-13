import { Inject, Injectable } from '@nestjs/common';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { Carousel } from './entities/carousel.entity';
import { CAROUSEL_REPOSITORY } from '../../constants';

@Injectable()
export class CarouselService {
  constructor(
    @Inject(CAROUSEL_REPOSITORY)
    private readonly carouselRepository: typeof Carousel,
  ) {}

  async create(
    createCarouselDto: CreateCarouselDto,
    files: Express.Multer.File[],
    user: any,
  ) {
    const data = await this.carouselRepository.create({
      ...createCarouselDto,
      imageUrl: files[0]?.filename || '',
      createdBy: user.id,
    } as any as Carousel);

    return data;
  }

  async findAll() {
    return `This action returns all carousel`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} carousel`;
  }

  async update(id: number, updateCarouselDto: UpdateCarouselDto) {
    return `This action updates a #${id} carousel`;
  }

  async remove(id: number) {
    return `This action removes a #${id} carousel`;
  }
}
