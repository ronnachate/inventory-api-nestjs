import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PriceRate } from '../entities/price.rate.entity';

@Injectable()
export class PriceRateRepository extends Repository<PriceRate> {
  constructor(private dataSource: DataSource) {
    super(PriceRate, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<PriceRate> {
    const user = await this.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
