import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserDTO } from '../../user/dtos/user.dto';
import { ROLE } from '../constant/role.enum';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockedUserService = {
    validateLoginUser: jest.fn(),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: UserService, useValue: mockedUserService },],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const userDTO: UserDTO = {
      id: 6,
      title: 'Mr',
      name: 'Jhon',
      lastname: 'Doe',
      username: 'jhon',
      roles: [ROLE.USER],
      status: {id: 1, name: 'Active'},
      createdAt: '2021-07-01T00:00:00.000Z',
      updatedAt: '2021-07-01T00:00:00.000Z',
    };
    it('should return user dto when username/password is valid', async () => {
      jest
        .spyOn(mockedUserService, 'validateLoginUser')
        .mockImplementation(() => userDTO);

      var loginUser = await service.validateUser('jhon', 'password');
        expect(loginUser.id).toEqual(userDTO.id);
        expect(loginUser.username).toEqual(userDTO.username);
        expect(loginUser.roles).toEqual(userDTO.roles);
      expect(mockedUserService.validateLoginUser).toBeCalledWith(
        'jhon',
        'password',
      );
    });

    it('should thrown error when username/password invalid', async () => {
      jest
        .spyOn(mockedUserService, 'validateLoginUser')
        .mockImplementation(() => {
          throw new UnauthorizedException();
        });

      await expect(
        service.validateUser('jhon', 'password'),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should fail when user account is disabled', async () => {
      jest
        .spyOn(mockedUserService, 'validateLoginUser')
        .mockImplementation(() => ({ ...userDTO, status: {id: 2, name: 'Disabled'} }));

      await expect(
        service.validateUser('jhon', 'password'),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
