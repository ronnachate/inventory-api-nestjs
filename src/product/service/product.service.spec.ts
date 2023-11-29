import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from '../repositories/product.repository';
import { LoggerService } from '../../../src/shared/logger/logger.service';
import { NotFoundException } from '@nestjs/common';
import { Equal, Not } from 'typeorm';
import {
  PRODUCT_ACTIVE_STATUS,
  PRODUCT_DELETED_STATUS,
} from '../../../src/shared/constant/generic';

describe('ProductService', () => {
  let service: ProductService;

  const mockedRepository = {
    getById: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const product3 = {
    id: 1,
    name: 'Product num3',
  };

  const product4 = {
    id: 2,
    name: 'Product num4',
  };

  beforeEach(async () => {
    const mockedLogger = { setContext: jest.fn(), log: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mockedRepository,
        },
        { provide: LoggerService, useValue: mockedLogger },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    const page = 1;
    const rows = 10;
    mockedRepository.findAndCount.mockResolvedValue([[product3, product4], 2]);
    it('should return products as a list', async () => {
      await service.getProducts(page, rows);
      expect(mockedRepository.findAndCount).toHaveBeenCalled();
    });

    it('should filter out deleted product if no status defined', async () => {
      await service.getProducts(page, rows);
      let offset = (page - 1) * rows;
      let expectedFilter = {
        where: { status: Not(PRODUCT_DELETED_STATUS) },
        take: rows,
        skip: offset,
      };
      expect(mockedRepository.findAndCount).toHaveBeenCalledWith(
        expectedFilter
      );
    });

    it('should filtering by status if status defined', async () => {
      let status = 1;
      await service.getProducts(page, rows, status);
      let offset = (page - 1) * rows;
      let expectedFilter = {
        where: { status: Equal(status) },
        take: rows,
        skip: offset,
      };
      expect(mockedRepository.findAndCount).toHaveBeenCalledWith(
        expectedFilter
      );
    });
  });

  describe('getProductById', () => {
    beforeEach(() => {
      jest
        .spyOn(mockedRepository, 'getById')
        .mockImplementation(async () => product4);
    });

    it('should return correct product using given product id', async () => {
      await service.getProductById(product4.id);
      expect(mockedRepository.getById).toBeCalledWith(product4.id);
    });

    it('should return correct product product data using given product id', async () => {
      const result = await service.getProductById(product4.id);

      expect(result).toEqual({
        id: product4.id,
        name: product4.name,
      });
    });

    it('throw not found exception if no product with given id found', async () => {
      mockedRepository.getById.mockRejectedValue(new NotFoundException());
      try {
        await service.getProductById(1);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('createProduct', () => {
    it('should return correct product with id and default status', async () => {
      jest.spyOn(mockedRepository, 'save').mockImplementation(async (input) => {
        input.id = 5;
        return input;
      });

      const productInput = {
        name: 'product5',
        description: null,
        price: 500,
      };

      const result = await service.newProduct(productInput);

      expect(result.id).toEqual(5);
      expect(result.name).toEqual(productInput.name);
      //set to active by default
      expect(result.status.id).toEqual(PRODUCT_ACTIVE_STATUS);
    });
  });
});
