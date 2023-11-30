import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryRepository } from '../repositories/category.repository';
import { LoggerService } from '../../../src/shared/logger/logger.service';
import { NotFoundException } from '@nestjs/common';
import { Not } from 'typeorm';
import {
  GENERIC_USING_STATUS,
  GENERIC_DELETED_STATUS,
} from '../../../src/shared/constant/generic';

describe('CategoryService', () => {
  let service: CategoryService;

  const mockedRepository = {
    getById: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const category3 = {
    id: 1,
    name: 'Category num3',
  };

  const category4 = {
    id: 2,
    name: 'Category num4',
  };

  beforeEach(async () => {
    const mockedLogger = { setContext: jest.fn(), log: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: mockedRepository,
        },
        { provide: LoggerService, useValue: mockedLogger },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCategories', () => {
    const page = 1;
    const rows = 10;
    mockedRepository.findAndCount.mockResolvedValue([[category3, category4], 2]);
    it('should return categories as a list', async () => {
      await service.getCategories(page, rows);
      expect(mockedRepository.findAndCount).toHaveBeenCalled();
    });

    it('should filter out deleted categories', async () => {
      await service.getCategories(page, rows);
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

  describe('getCategoryById', () => {
    beforeEach(() => {
      jest
        .spyOn(mockedRepository, 'getById')
        .mockImplementation(async () => category4);
    });

    it('should return correct category using given category id', async () => {
      await service.getCategoryById(category4.id);
      expect(mockedRepository.getById).toBeCalledWith(category4.id);
    });

    it('should return correct category category data using given category id', async () => {
      const result = await service.getCategoryById(category4.id);

      expect(result).toEqual({
        id: category4.id,
        name: category4.name,
      });
    });

    it('throw not found exception if no category with given id found', async () => {
      mockedRepository.getById.mockRejectedValue(new NotFoundException());
      try {
        await service.getCategoryById(1);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('newCategory', () => {
    it('should return correct category with id and default status', async () => {
      jest.spyOn(mockedRepository, 'save').mockImplementation(async (input) => {
        input.id = 5;
        return input;
      });

      const categoryInput = {
        name: 'category5',
        description: null,
        price: 500,
      };

      const result = await service.newCategory(categoryInput);

      expect(result.id).toEqual(5);
      expect(result.name).toEqual(categoryInput.name);
      //set to active by default
      expect(result.statusId).toEqual(GENERIC_USING_STATUS);
    });
  });
});
