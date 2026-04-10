import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateProductMediaDto {
  @IsString()
  path!: string;

  @IsString()
  filename!: string;

  @IsString()
  type!: string;

  @Type(() => Number)
  @IsInt()
  size!: number;
}

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @Type(() => Number)
  @IsInt()
  price!: number;

  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  categories!: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductMediaDto)
  medias?: CreateProductMediaDto[];
}
