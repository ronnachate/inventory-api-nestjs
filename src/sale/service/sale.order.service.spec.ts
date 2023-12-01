import { Test, TestingModule } from '@nestjs/testing';
import { SaleOrderService } from './sale.order.service';
import { SaleOrderRepository } from '../repositories/sale.order.repository';
import { LoggerService } from '../../../src/shared/logger/logger.service';
import { NotFoundException } from '@nestjs/common';
import { Not } from 'typeorm';
import {
  GENERIC_USING_STATUS,
  GENERIC_DELETED_STATUS,
} from '../../../src/shared/constant/generic';

describe('SaleOrderService', () => {
  let service: SaleOrderService;

  const mockedRepository = {
    getById: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const order1 = {
    id: 1,
  };

  const order2 = {
    id: 2,
  };

  beforeEach(async () => {
    const mockedLogger = { setContext: jest.fn(), log: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleOrderService,
        {
          provide: SaleOrderRepository,
          useValue: mockedRepository,
        },
        { provide: LoggerService, useValue: mockedLogger },
      ],
    }).compile();

    service = module.get<SaleOrderService>(SaleOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSaleOrders', () => {
    const page = 1;
    const rows = 10;
    mockedRepository.findAndCount.mockResolvedValue([[order1, order2], 2]);
    it('should return orders as a list', async () => {
      await service.getSaleOrders(page, rows);
      expect(mockedRepository.findAndCount).toHaveBeenCalled();
    });

    it('should filter out deleted orders', async () => {
      await service.getSaleOrders(page, rows);
      let offset = (page - 1) * rows;
      let expectedFilter = {
        where: {},
        take: rows,
        skip: offset,
      };
      expect(mockedRepository.findAndCount).toHaveBeenCalledWith(
        expectedFilter
      );
    });
  });

  describe('getSaleOrderById', () => {
    beforeEach(() => {
      jest
        .spyOn(mockedRepository, 'getById')
        .mockImplementation(async () => order2);
    });

    it('should return order using given order id', async () => {
      await service.getSaleOrderById(order2.id);
      expect(mockedRepository.getById).toBeCalledWith(order2.id);
    });

    it('should return correct order data using given order id', async () => {
      const result = await service.getSaleOrderById(order2.id);

      expect(result).toEqual({
        id: order2.id,
      });
    });

    it('throw not found exception if no order with given id found', async () => {
      mockedRepository.getById.mockRejectedValue(new NotFoundException());
      try {
        await service.getSaleOrderById(1);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
