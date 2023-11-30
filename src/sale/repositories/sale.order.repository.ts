import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { SaleOrder } from '../entities/sale.order.entity';

@Injectable()
export class SaleOrderRepository extends Repository<SaleOrder> {
  constructor(private dataSource: DataSource) {
    super(SaleOrder, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<SaleOrder> {
    const order = await this.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException();
    }

    return order;
  }
}
