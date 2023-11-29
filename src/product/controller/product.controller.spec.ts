import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../service/product.service';
import { LoggerService } from '../../shared/logger/logger.service';
import { ProductPaginationParams } from '../query-params/pagination-params';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { INTERNAL_SERVER_ERROR_MSG } from '../../shared/constant/generic';
import { NewProductDTO } from '../dtos/new-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  const mockedProductService = {
    getProducts: jest.fn(),
    getProductById: jest.fn(),
    newProduct: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), error: jest.fn() };

  const currentDate = new Date();
  const product3 = {
    id: 3,
    name: 'Product3',
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    status: null,
  };

  const product4 = {
    id: 4,
    name: 'Product4',
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    status: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockedProductService },
        { provide: LoggerService, useValue: mockedLogger },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get Products as a list', () => {
    const page = 1;
    const rows = 10;
    const resultCount = 2;
    const query: ProductPaginationParams = {
      page: page,
      rows: rows,
      status: undefined,
      category: undefined,
    };

    it('should call getProducts function', () => {
      mockedProductService.getProducts.mockResolvedValue({ products: [], count: 0 });
      controller.getProducts(query);
      expect(mockedProductService.getProducts).toHaveBeenCalled();
    });

    it('should return correct result', async () => {
      const pagination = { page: page, rows: rows, count: resultCount };
      mockedProductService.getProducts.mockResolvedValue({
        products: [product3, product4],
        count: resultCount,
      });
      var result = await controller.getProducts(query);
      expect(result.items).toEqual([product3, product4]);
      expect(result.pagination).toEqual(pagination);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedProductService.getProducts.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.getProducts(query);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });
  });

  describe('Get product by id', () => {
    it('should return correct product', async () => {
      mockedProductService.getProductById.mockResolvedValue(product3);

      expect(await controller.getProduct(product3.id)).toEqual(product3);
      expect(mockedProductService.getProductById).toHaveBeenCalledWith(product3.id);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedProductService.getProductById.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.getProduct(1);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });

    it('should thrown error 404 when service thrown NotFoundException', async () => {
      mockedProductService.getProductById.mockRejectedValue(
        new NotFoundException()
      );
      try {
        await controller.getProduct(1);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(404);
      }
    });
  });

  describe('New product', () => {
    const input = new NewProductDTO();
    it('New product should return corect product', async () => {
      const productDto = {
        name: 'product5',
        productname: 'product5',
      };
      mockedProductService.newProduct.mockResolvedValue(productDto);

      expect(await controller.createProduct(input)).toEqual(productDto);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedProductService.newProduct.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.createProduct(input);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });
  });
});
