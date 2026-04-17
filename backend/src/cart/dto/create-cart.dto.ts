import { IsNumber } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  price!: number;

  @IsNumber()
  quantity!: number;
}
