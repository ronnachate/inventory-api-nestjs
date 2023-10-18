import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { LoggerService } from '../../../src/shared/logger/logger.service';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  const mockedRepository = {
    getById: jest.fn(),
    findAndCount: jest.fn(),
  };

  const user3 = {
    id: 3,
    username: 'user3',
    name: 'User num3',
  };

  const user4 = {
    id: 4,
    username: 'user4',
    name: 'User num4',
  };

  beforeEach(async () => {
    const mockedLogger = { setContext: jest.fn(), log: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockedRepository,
        },
        { provide: LoggerService, useValue: mockedLogger },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('gets users as a list', async () => {
      const page = 1;
      const rows = 10;
      mockedRepository.findAndCount.mockResolvedValue([[user3, user4], 2]);
      await service.getUsers(page, rows);
      expect(mockedRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    beforeEach(() => {
      jest
        .spyOn(mockedRepository, 'getById')
        .mockImplementation(async () => user4);
    });

    it('should return correct user using given user id', async () => {
      await service.getUserById(user4.id);
      expect(mockedRepository.getById).toBeCalledWith(user4.id);
    });

    it('should return correct user user data using given user id', async () => {
      const result = await service.getUserById(user4.id);

      expect(result).toEqual({
        id: user4.id,
        name: user4.name,
        username: user4.username,
      });
    });

    it('throw not found exception if no user with given id found', async () => {
      mockedRepository.getById.mockRejectedValue(new NotFoundException());
      try {
        await service.getUserById(5);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

});
