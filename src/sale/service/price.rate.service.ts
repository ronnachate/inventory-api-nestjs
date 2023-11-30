import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../shared/logger/logger.service';
import { PriceRateRepository } from '../repositories/price.rate.repository';
import { plainToClass, plainToInstance } from 'class-transformer';
import { PriceRateDTO } from '../dtos/price.rate.dto';
import { Not } from 'typeorm';
import {
  GENERIC_USING_STATUS,
  GENERIC_DELETED_STATUS,
} from '../../shared/constant/generic';
import { NewPriceRateDTO } from '../dtos/new-pricerate.dto';
import { PriceRate } from '../entities/price.rate.entity';

@Injectable()
export class PriceRateService {
  constructor(
    private repository: PriceRateRepository,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(PriceRateService.name);
  }

  async getPriceRates(
    page: number,
    rows: number
  ): Promise<{ rates: PriceRateDTO[]; count: number }> {
    let offset = (page - 1) * rows;
    let filters = {
      where: { statusId: Not(GENERIC_DELETED_STATUS) },
      take: rows,
      skip: offset,
    };
    const [rates, count] = await this.repository.findAndCount(filters);

    const ratesOutput = plainToInstance(PriceRateDTO, rates, {
      excludeExtraneousValues: true,
    });

    return { rates: ratesOutput, count };
  }

  async getPriceRateById(id: number): Promise<PriceRateDTO> {
    const priceRate = await this.repository.getById(id);

    return plainToInstance(PriceRateDTO, priceRate, {
      excludeExtraneousValues: true,
    });
  }

  async newPriceRate(input: NewPriceRateDTO): Promise<PriceRateDTO> {
    let priceRate = plainToClass(PriceRate, input);
    priceRate.statusId = GENERIC_USING_STATUS;
    await this.repository.save(priceRate);

    return plainToClass(PriceRateDTO, priceRate, {
      excludeExtraneousValues: true,
    });
  }
}
