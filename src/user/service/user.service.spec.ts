import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { LoggerService } from '../../../src/shared/logger/logger.service';
import { NotFoundException } from '@nestjs/common';
import { Equal, Not } from 'typeorm';
import { USER_ACTIVE_STATUS, USER_DELETED_STATUS } from '../../../src/shared/constant/generic';
import e from 'express';

describe('UserService', () => {
  let service: UserService;

  const mockedRepository = {
    getById: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
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
    const page = 1;
    const rows = 10;
    mockedRepository.findAndCount.mockResolvedValue([[user3, user4], 2]);
    it('should return users as a list', async () => {
      await service.getUsers(page, rows);
      expect(mockedRepository.findAndCount).toHaveBeenCalled();
    });

    it('should filter out deleted user if no status defined', async () => {
      await service.getUsers(page, rows);
      let offset = (page - 1) * rows;
      let expectedFilter = {
        where: { status: Not(USER_DELETED_STATUS) },
        take: rows,
        skip: offset,
      };
      expect(mockedRepository.findAndCount).toHaveBeenCalledWith(
        expectedFilter
      );
    });

    it('should filtering by status if status defined', async () => {
      let status = 1;
      await service.getUsers(page, rows, status);
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

  describe('createUser', () => {
    it('should return correct user with id and default status', async () => {
      jest.spyOn(mockedRepository, 'save').mockImplementation(async (input) => {
        input.id = 5;
        return input;
      });

      const userInput = {
        title: null,
        name: 'user5',
        lastname: null,
        username: 'user5',
      };

      const result = await service.createUser(userInput);

      expect(result.id).toEqual(5);
      expect(result.name).toEqual(userInput.name);
      expect(result.username).toEqual(userInput.username);
      //set to active by default
      expect(result.status.id).toEqual(USER_ACTIVE_STATUS);
    });
  });
});
