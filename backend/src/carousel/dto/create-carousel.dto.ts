import { IsString } from 'class-validator';

export class CreateCarouselDto {
  @IsString()
  label: string;

  @IsString()
  imageUrl: string;

  @IsString()
  description?: string;
}
