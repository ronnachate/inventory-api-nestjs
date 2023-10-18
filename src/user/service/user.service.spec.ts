import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { LoggerService } from '../../../src/shared/logger/logger.service';

describe('UserService', () => {
  let service: UserService;

  const mockedRepository = {
    findOne: jest.fn(),
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
});
