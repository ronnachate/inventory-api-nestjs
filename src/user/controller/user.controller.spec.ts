import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { LoggerService } from '../../shared/logger/logger.service';

describe('UserController', () => {
  let controller: UserController;
  const mockedUserService = {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

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
});
