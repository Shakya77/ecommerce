import { IsNumber } from 'class-validator';

export class CreateWishlistDto {
  @IsNumber()
  productId: number;
}
