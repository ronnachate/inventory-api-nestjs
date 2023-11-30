import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from './product.repository';
import { DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';
import { NotFoundException } from '@nestjs/common/exceptions';

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let dataSource: {
    createEntityManager: jest.Mock;
  };
  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Get product by id', () => {
    const currentDate = new Date();
    const id = 99;

    const expectedOutput: Product = {
      id,
      name: 'Product1',
      description: 'description1',
      createdAt: currentDate,
      updatedAt: currentDate,
      price: 100,
      status: null,
      imagePath: 'imagePath1',
      options: [],
      addons: [],
      saleItems: [],
      category: null,
    };

    it('should call findOne with correct product id', () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      repository.getById(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return correct product data', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      expect(await repository.getById(id)).toEqual(expectedOutput);
    });

    it('should throw NotFoundError when no product found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      try {
        await repository.getById(id);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });
  });
});
