import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../shared/logger/logger.service';
import { SaleOrderRepository } from '../repositories/sale.order.repository';
import { plainToClass, plainToInstance } from 'class-transformer';
import { SaleOrderDTO } from '../dtos/sale.order.dto';

@Injectable()
export class SaleOrderService {
  constructor(
    private repository: SaleOrderRepository,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(SaleOrderService.name);
  }

  async getSaleOrders(
    page: number,
    rows: number
  ): Promise<{ orders: SaleOrderDTO[]; count: number }> {
    let offset = (page - 1) * rows;
    let filters = {
      where: {},
      take: rows,
      skip: offset,
    };
    const [orders, count] = await this.repository.findAndCount(filters);

    const ordersOutput = plainToInstance(SaleOrderDTO, orders, {
      excludeExtraneousValues: true,
    });

    return { orders: ordersOutput, count };
  }

  async getSaleOrderById(id: number): Promise<SaleOrderDTO> {
    const order = await this.repository.getById(id);

    return plainToInstance(SaleOrderDTO, order, {
      excludeExtraneousValues: true,
    });
  }
}
