import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from '../service/category.service';
import { LoggerService } from '../../shared/logger/logger.service';
import { CategoryPaginationParams } from '../query-params/category-pagination-params';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { INTERNAL_SERVER_ERROR_MSG } from '../../shared/constant/generic';
import { NewCategoryDTO } from '../dtos/new-category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;
  const mockedCategoryService = {
    getCategories: jest.fn(),
    getCategoryById: jest.fn(),
    newCategory: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), error: jest.fn() };

  const currentDate = new Date();
  const category3 = {
    id: 3,
    name: 'Category3',
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    status: null,
  };

  const category4 = {
    id: 4,
    name: 'Category4',
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    status: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        { provide: CategoryService, useValue: mockedCategoryService },
        { provide: LoggerService, useValue: mockedLogger },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get Categories as a list', () => {
    const page = 1;
    const rows = 10;
    const resultCount = 2;
    const query: CategoryPaginationParams = {
      page: page,
      rows: rows
    };

    it('should call getCategories function', () => {
      mockedCategoryService.getCategories.mockResolvedValue({ categories: [], count: 0 });
      controller.getCategories(query);
      expect(mockedCategoryService.getCategories).toHaveBeenCalled();
    });

    it('should return correct result', async () => {
      const pagination = { page: page, rows: rows, count: resultCount };
      mockedCategoryService.getCategories.mockResolvedValue({
        categories: [category3, category4],
        count: resultCount,
      });
      var result = await controller.getCategories(query);
      expect(result.items).toEqual([category3, category4]);
      expect(result.pagination).toEqual(pagination);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedCategoryService.getCategories.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.getCategories(query);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });
  });

  describe('Get category by id', () => {
    it('should return correct category', async () => {
      mockedCategoryService.getCategoryById.mockResolvedValue(category3);

      expect(await controller.getCategory(category3.id)).toEqual(category3);
      expect(mockedCategoryService.getCategoryById).toHaveBeenCalledWith(category3.id);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedCategoryService.getCategoryById.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.getCategory(1);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });

    it('should thrown error 404 when service thrown NotFoundException', async () => {
      mockedCategoryService.getCategoryById.mockRejectedValue(
        new NotFoundException()
      );
      try {
        await controller.getCategory(1);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(404);
      }
    });
  });

  describe('New category', () => {
    const input = new NewCategoryDTO();
    it('New category should return corect category', async () => {
      const categoryDto = {
        name: 'category5',
      };
      mockedCategoryService.newCategory.mockResolvedValue(categoryDto);

      expect(await controller.createCategory(input)).toEqual(categoryDto);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedCategoryService.newCategory.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.createCategory(input);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });
  });
});
