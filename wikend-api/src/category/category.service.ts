import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoryRepository.save({
        descripcion: createCategoryDto.descripcion,
      });
    } catch (error) {}
  }

  async findAll() {
    try {
      const arrCategory = await this.categoryRepository.find();
      return arrCategory;
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.categoryRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!product) {
        throw new NotFoundException('La categoria no existe.');
      } else {
        return product;
      }
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.categoryRepository.update(id, updateCategoryDto);
    } catch (error) {
      return error;
    }
  }

  async remove(id: number) {
    try {
      return await this.categoryRepository.delete(id);
    } catch (error) {
      return error;
    }
  }
}
