import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserStatus } from '../entities/user.status.entity';

describe('UserRepository', () => {
  let repository: UserRepository;
  let dataSource: {
    createEntityManager: jest.Mock;
  };
  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Get user by id', () => {
    const currentDate = new Date();
    const id = 1;

    const expectedOutput: User = {
      id,
      title: 'title1',
      name: 'User1',
      lastname: 'lastname1',
      username: 'user1',
      createdAt: currentDate,
      updatedAt: currentDate,
      status: null,
      permission: null,
    };

    it('should call findOne with correct user id', () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      repository.getById(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return correct user data', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      expect(await repository.getById(1)).toEqual(expectedOutput);
    });
  });
});
