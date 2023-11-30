import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../shared/logger/logger.service';
import { CategoryRepository } from '../repositories/category.repository';
import { plainToClass, plainToInstance } from 'class-transformer';
import { CategoryDTO } from '../dtos/category.dto';
import { Not } from 'typeorm';
import {
  GENERIC_USING_STATUS,
  GENERIC_DELETED_STATUS,
} from '../../shared/constant/generic';
import { NewCategoryDTO } from '../dtos/new-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    private repository: CategoryRepository,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(CategoryService.name);
  }

  async getCategories(
    page: number,
    rows: number
  ): Promise<{ categories: CategoryDTO[]; count: number }> {
    let offset = (page - 1) * rows;
    let filters = {
      where: { statusId: Not(GENERIC_DELETED_STATUS) },
      take: rows,
      skip: offset,
    };
    const [categories, count] = await this.repository.findAndCount(filters);

    const categoriesOutput = plainToInstance(CategoryDTO, categories, {
      excludeExtraneousValues: true,
    });

    return { categories: categoriesOutput, count };
  }

  async getCategoryById(id: number): Promise<CategoryDTO> {
    const category = await this.repository.getById(id);

    return plainToInstance(CategoryDTO, category, {
      excludeExtraneousValues: true,
    });
  }

  async newCategory(input: NewCategoryDTO): Promise<CategoryDTO> {
    let category = plainToClass(Category, input);
    category.statusId = GENERIC_USING_STATUS;
    await this.repository.save(category);

    return plainToClass(CategoryDTO, category, {
      excludeExtraneousValues: true,
    });
  }
}
