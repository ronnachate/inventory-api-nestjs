import { Test, TestingModule } from '@nestjs/testing';
import { PriceRateService } from './price.rate.service';
import { PriceRateRepository } from '../repositories/price.rate.repository';
import { LoggerService } from '../../../src/shared/logger/logger.service';
import { NotFoundException } from '@nestjs/common';
import { Not } from 'typeorm';
import {
  GENERIC_USING_STATUS,
  GENERIC_DELETED_STATUS,
} from '../../../src/shared/constant/generic';

describe('PriceRateService', () => {
  let service: PriceRateService;

  const mockedRepository = {
    getById: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const rate1 = {
    id: 1,
    name: 'PriceRate num1',
  };

  const rate2 = {
    id: 2,
    name: 'PriceRate num2',
  };

  beforeEach(async () => {
    const mockedLogger = { setContext: jest.fn(), log: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceRateService,
        {
          provide: PriceRateRepository,
          useValue: mockedRepository,
        },
        { provide: LoggerService, useValue: mockedLogger },
      ],
    }).compile();

    service = module.get<PriceRateService>(PriceRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPriceRates', () => {
    const page = 1;
    const rows = 10;
    mockedRepository.findAndCount.mockResolvedValue([[rate1, rate2], 2]);
    it('should return rates as a list', async () => {
      await service.getPriceRates(page, rows);
      expect(mockedRepository.findAndCount).toHaveBeenCalled();
    });

    it('should filter out deleted rates', async () => {
      await service.getPriceRates(page, rows);
      let offset = (page - 1) * rows;
      let expectedFilter = {
        where: { statusId: Not(GENERIC_DELETED_STATUS) },
        take: rows,
        skip: offset,
      };
      expect(mockedRepository.findAndCount).toHaveBeenCalledWith(
        expectedFilter
      );
    });
  });

  describe('getPriceRateById', () => {
    beforeEach(() => {
      jest
        .spyOn(mockedRepository, 'getById')
        .mockImplementation(async () => rate1);
    });

    it('should return rate using given rate id', async () => {
      await service.getPriceRateById(rate1.id);
      expect(mockedRepository.getById).toBeCalledWith(rate1.id);
    });

    it('should return correct rate data using given rate id', async () => {
      const result = await service.getPriceRateById(rate1.id);

      expect(result).toEqual({
        id: rate1.id,
        name: rate1.name,
      });
    });

    it('throw not found exception if no rate with given id found', async () => {
      mockedRepository.getById.mockRejectedValue(new NotFoundException());
      try {
        await service.getPriceRateById(1);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('newPriceRate', () => {
    it('should return correct rate with id and default status', async () => {
      jest.spyOn(mockedRepository, 'save').mockImplementation(async (input) => {
        input.id = 5;
        return input;
      });

      const rateInput = {
        name: 'internal',
        description: null,
        price: 500,
      };

      const result = await service.newPriceRate(rateInput);

      expect(result.id).toEqual(5);
      expect(result.name).toEqual(rateInput.name);
      //set to active by default
      expect(result.statusId).toEqual(GENERIC_USING_STATUS);
    });
  });
});
