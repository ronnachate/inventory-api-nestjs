import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { LoggerService } from '../../shared/logger/logger.service';
import { UserPaginationParams } from '../query-params/pagination-params';
import { PaginationResultset } from 'src/shared/dtos/pagination-resultset';
import { UserDTO } from '../dtos/user.dto';

describe('UserController', () => {
  let controller: UserController;
  const mockedUserService = {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  const currentDate = new Date();
  const user3 = {
    id: 3,
    title: 'tiel',
    name: 'User3',
    username: 'user3',
    lasname: 'lastname3',
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    status: null
  };

  const user4 = {
    id: 4,
    title: 'title',
    name: 'User4',
    username: 'user4',
    lasname: 'lastname4',
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    status: null
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockedUserService },
        { provide: LoggerService, useValue: mockedLogger },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get Users as a list', () => {
    it('should call getUsers function', () => {
      const query: UserPaginationParams = {
        page: 1,
        rows: 10,
        status: undefined
      };
      mockedUserService.getUsers.mockResolvedValue({ users: [], count: 0 });
      controller.getUsers(query);
      expect(mockedUserService.getUsers).toHaveBeenCalled();
    });

    it('should return correct result', async () => {
      const page = 1;
      const rows = 10;
      const resultCount = 2;
      const query: UserPaginationParams = {
        page: page,
        rows: rows,
        status: undefined
      };
      const pagination = { page: page, rows: rows, count: resultCount };
      mockedUserService.getUsers.mockResolvedValue({ users: [user3, user4], count: resultCount });
      var result = await controller.getUsers(query);
      expect(result.items).toEqual([user3, user4]);
      expect(result.pagination).toEqual(pagination);
    });
  });
});
