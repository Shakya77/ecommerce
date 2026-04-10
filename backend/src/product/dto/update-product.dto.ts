import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  keepMediaIds?: number[];
}
