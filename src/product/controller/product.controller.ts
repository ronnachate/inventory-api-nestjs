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
import { ProductService } from '../service/product.service';
import { ProductDTO } from '../dtos/product.dto';
import { ProductPaginationParams } from '../query-params/pagination-params';
import { PaginationResultset } from '../../shared/dtos/pagination-resultset';
import { INTERNAL_SERVER_ERROR_MSG } from '../../shared/constant/generic';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewProductDTO } from '../dtos/new-product.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ROLE } from '../../auth/constant/role.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';

@ApiTags('products')
@Controller('v1/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(ProductController.name);
  }

  @Get()
  @ApiOperation({
    summary: 'Get products with pagination',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginationResultset<ProductDTO[]>,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @Roles(ROLE.ADMIN)
  async getProducts(
    @Query() query: ProductPaginationParams
  ): Promise<PaginationResultset<ProductDTO[]>> {
    try {
      const { page = 1, rows = 10 } = query;
      const { products, count } = await this.productService.getProducts(
        page,
        rows,
        query.status,
        query.category
      );

      return { items: products, pagination: { page, rows, count } };
    } catch (error) {
      this.logger.error('getProducts error with', query);
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
    summary: 'Get product by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @Roles(ROLE.ADMIN)
  async getProduct(@Param('id') id: number): Promise<ProductDTO> {
    try {
      const product = await this.productService.getProductById(id);
      return product;
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
        this.logger.error(`getProducts error with id "${id}"`, error);
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
    summary: 'Create new product',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @Roles(ROLE.ADMIN)
  async createProduct(@Body() input: NewProductDTO): Promise<ProductDTO> {
    try {
      const product = await this.productService.newProduct(input);
      return product;
    } catch (error) {
      this.logger.error('create product error with', { input, error });
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
