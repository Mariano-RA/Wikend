import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { Product } from 'src/product/entities/product.entity';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
