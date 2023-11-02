import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserDTO } from '../../user/dtos/user.dto';
import { ROLE } from '../constant/role.enum';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  const mockedUserService = {
    validateLoginUser: jest.fn(),
  };

  const mockedConfigService = { get: jest.fn() };
  const mockedJwtService = { signAsync: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockedUserService },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: ConfigService, useValue: mockedConfigService },
      ],
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
      status: { id: 1, name: 'Active' },
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
        'password'
      );
    });

    it('should thrown error when username/password invalid', async () => {
      jest
        .spyOn(mockedUserService, 'validateLoginUser')
        .mockImplementation(() => {
          throw new UnauthorizedException();
        });

      await expect(
        service.validateUser('jhon', 'password')
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should fail when user account is disabled', async () => {
      jest
        .spyOn(mockedUserService, 'validateLoginUser')
        .mockImplementation(() => ({
          ...userDTO,
          status: { id: 2, name: 'Disabled' },
        }));

      await expect(
        service.validateUser('jhon', 'password')
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('getAuthToken', () => {
    const expiry = 100;
    const user = { id: 5, username: 'username', roles: [ROLE.USER] };

    const payload = {
      username: user.username,
      sub: user.id,
      roles: [ROLE.USER],
    };

    beforeEach(() => {
      jest.spyOn(mockedConfigService, 'get').mockImplementation(() => expiry);

      jest
        .spyOn(mockedJwtService, 'signAsync')
        .mockImplementation(async () => 'signed-response');
    });

    it('should generate access token with payload', async () => {
      const result = await service.getAuthToken(payload);

      expect(mockedJwtService.signAsync).toBeCalledWith(payload, {
        expiresIn: expiry,
      });

      expect(result).toMatchObject({
        accessToken: 'signed-response',
      });
    });

    it('should generate refresh token with subject', async () => {
      const result = await service.getAuthToken(payload);
      const subject = { sub: payload.sub };
      expect(mockedJwtService.signAsync).toBeCalledWith(subject, {
        expiresIn: expiry,
      });

      expect(result).toMatchObject({
        refreshToken: 'signed-response',
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
