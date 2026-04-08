import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutDto } from './create-produt.dto';

export class UpdateProdutDto extends PartialType(CreateProdutDto) {}
