import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoggerService } from '../../shared/logger/logger.service';
import { CategoryService } from '../service/category.service';
import { CategoryDTO } from '../dtos/category.dto';
import { CategoryPaginationParams } from '../query-params/category-pagination-params';
import { PaginationResultset } from '../../shared/dtos/pagination-resultset';
import { INTERNAL_SERVER_ERROR_MSG } from '../../shared/constant/generic';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewCategoryDTO } from '../dtos/new-category.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ROLE } from '../../auth/constant/role.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';

@ApiTags('categories')
@Controller('v1/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(CategoryController.name);
  }

  @Get()
  @ApiOperation({
    summary: 'Get categories with pagination',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginationResultset<CategoryDTO[]>,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @Roles(ROLE.USER)
  async getCategories(
    @Query() query: CategoryPaginationParams
  ): Promise<PaginationResultset<CategoryDTO[]>> {
    try {
      const { page = 1, rows = 10 } = query;
      const { categories, count } = await this.categoryService.getCategories(
        page,
        rows
      );

      return { items: categories, pagination: { page, rows, count } };
    } catch (error) {
      this.logger.error('getCategories error with', query);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: INTERNAL_SERVER_ERROR_MSG,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        }
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @Roles(ROLE.USER)
  async getCategory(@Param('id') id: number): Promise<CategoryDTO> {
    try {
      const category = await this.categoryService.getCategoryById(id);
      return category;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          }
        );
      } else {
        this.logger.error(`getCategorys error with id "${id}"`, error);
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: INTERNAL_SERVER_ERROR_MSG,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
          {
            cause: error,
          }
        );
      }
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create new category',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @Roles(ROLE.USER)
  async createCategory(@Body() input: NewCategoryDTO): Promise<CategoryDTO> {
    try {
      const category = await this.categoryService.newCategory(input);
      return category;
    } catch (error) {
      this.logger.error('create category error with', { input, error });
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: INTERNAL_SERVER_ERROR_MSG,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        }
      );
    }
  }
}
