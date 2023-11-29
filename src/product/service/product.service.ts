import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../shared/logger/logger.service';
import { ProductRepository } from '../repositories/product.repository';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ProductDTO } from '../dtos/product.dto';
import { Equal, Not } from 'typeorm';
import { PRODUCT_ACTIVE_STATUS, PRODUCT_DELETED_STATUS } from '../../shared/constant/generic';
import { NewProductDTO } from '../dtos/new-product.dto';
import { Product } from '../entities/product.entity';
import { ProductStatus } from '../entities/product.status.entity';

@Injectable()
export class ProductService {
  constructor(
    private repository: ProductRepository,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(ProductService.name);
  }

  async getProducts(
    page: number,
    rows: number,
    status?: number
  ): Promise<{ products: ProductDTO[]; count: number }> {
    let offset = (page - 1) * rows;
    let filters = {
      where: { status: Not(PRODUCT_DELETED_STATUS) },
      take: rows,
      skip: offset,
    };
    if (status) {
      filters.where.status = Equal(status);
    }
    const [products, count] = await this.repository.findAndCount(filters);

    const productsOutput = plainToInstance(ProductDTO, products, {
      excludeExtraneousValues: true,
    });

    return { products: productsOutput, count };
  }

  async getProductById(id: number): Promise<ProductDTO> {
    const product = await this.repository.getById(id);

    return plainToInstance(ProductDTO, product, {
      excludeExtraneousValues: true,
    });
  }

  async newProduct(
    input: NewProductDTO,
  ): Promise<ProductDTO> {

    let product = plainToClass(Product, input);
    product.status = { id: PRODUCT_ACTIVE_STATUS } as ProductStatus;
    await this.repository.save(product);

    return plainToClass(ProductDTO, product, {
      excludeExtraneousValues: true,
    });
  }
}
