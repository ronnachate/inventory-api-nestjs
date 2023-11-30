import { Test, TestingModule } from '@nestjs/testing';
import { PriceRateRepository } from './price.rate.repository';
import { DataSource } from 'typeorm';
import { PriceRate } from '../entities/price.rate.entity';
import { NotFoundException } from '@nestjs/common/exceptions';

describe('PriceRateRepository', () => {
  let repository: PriceRateRepository;
  let dataSource: {
    createEntityManager: jest.Mock;
  };
  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PriceRateRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<PriceRateRepository>(PriceRateRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Get price rate by id', () => {
    const currentDate = new Date();
    const id = 1;

    const expectedOutput: PriceRate = {
      id,
      name: 'PriceRate1',
      createdAt: currentDate,
      updatedAt: currentDate,
      orders: [],
      saleItems: [],
      productPriceRates: [],
    };

    it('should call findOne with correct price rate id', () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      repository.getById(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return correct price rate data', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      expect(await repository.getById(id)).toEqual(expectedOutput);
    });

    it('should throw NotFoundError when no price rate found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      try {
        await repository.getById(id);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });
  });
});
