import { Test, TestingModule } from '@nestjs/testing';
import { SaleOrderRepository } from './sale.order.repository';
import { DataSource } from 'typeorm';
import { SaleOrder } from '../entities/sale.order.entity';
import { NotFoundException } from '@nestjs/common/exceptions';

describe('SaleOrderRepository', () => {
  let repository: SaleOrderRepository;
  let dataSource: {
    createEntityManager: jest.Mock;
  };
  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SaleOrderRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<SaleOrderRepository>(SaleOrderRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Get order by id', () => {
    const currentDate = new Date();
    const id = 99;

    const expectedOutput: SaleOrder = {
      id,
      type: null,
      status: null,
      items: [],
      rate: null,
      discount: 0,
      vat: null,
      vatRate: null,
      isUsingVat: false,
      isIncludeVat: false,
      netPrice: 0,
      totalPrice: 0,
      createdAt: currentDate,
      updatedAt: currentDate,
      sellerId: null,
      note: '',
    };

    it('should call findOne with correct order id', () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      repository.getById(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return correct order data', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      expect(await repository.getById(id)).toEqual(expectedOutput);
    });

    it('should throw NotFoundError when no order found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      try {
        await repository.getById(id);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });
  });
});
