import { IsString, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';

export enum PromoTypeDto {
  AMOUNT = 'amount',
  PERCENTAGE = 'percentage',
}

export class CreatePromoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(PromoTypeDto)
  @IsNotEmpty()
  promoType: PromoTypeDto;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
