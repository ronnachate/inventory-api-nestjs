import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Product> {
    const product = await this.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }
}
