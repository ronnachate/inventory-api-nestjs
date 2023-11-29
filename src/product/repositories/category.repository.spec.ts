import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepository } from './category.repository';
import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import { NotFoundException } from '@nestjs/common/exceptions';

describe('CategoryRepository', () => {
  let repository: CategoryRepository;
  let dataSource: {
    createEntityManager: jest.Mock;
  };
  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Get category by id', () => {
    const currentDate = new Date();
    const id = 99;

    const expectedOutput: Category = {
      id,
      name: 'Category1',
      description: 'description1',
      products: [],
      createdAt: currentDate,
      updatedAt: currentDate,
      statusId: 1,
    };

    it('should call findOne with correct category id', () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      repository.getById(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return correct category data', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      expect(await repository.getById(id)).toEqual(expectedOutput);
    });

    it('should throw NotFoundError when no category found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      try {
        await repository.getById(id);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });
  });
});
