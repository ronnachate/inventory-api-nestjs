import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserDTO } from '../../user/dtos/user.dto';
import { ROLE } from '../constant/role.enum';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SigninDTO } from '../dtos/signin.dto';
import { AuthTokenDTO } from '../dtos/auth-token.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockedUserService = {
    validateLoginUser: jest.fn(),
  };
  const mockedConfigService = { get: jest.fn() };
  const mockedJwtService = { signAsync: jest.fn(), verifyAsync: jest.fn() };

  const authToken: AuthTokenDTO = {
    accessToken: 'random_access_token',
    refreshToken: 'random_refresh_token',
  };

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

  describe('signin', () => {
    it('should return auth token for valid user', async () => {
      jest.spyOn(service, 'getAuthToken').mockImplementation(async () => authToken);

      jest
        .spyOn(mockedUserService, 'validateLoginUser')
        .mockImplementation(async () => ({
          ...userDTO,
          status: { id: 1, name: 'Active' },
        }));

      const signInDto: SigninDTO = {
        username: 'jhon',
        password: 'password',
      }
      const payload = {
        username: userDTO.username,
        sub: userDTO.id,
        roles: userDTO.roles,
      };

      const result = await service.signIn(signInDto);

      expect(service.getAuthToken).toBeCalledWith(payload);
      expect(result).toEqual(authToken);
    });
  });

  describe('refreshToken', () => {
    it('should generate auth token or valid refresh token', async () => {
      jest.spyOn(service, 'getAuthToken').mockImplementation(async () => authToken);

      const refreshToken = 'random_refresh_token';
      const decoded = {
        sub: userDTO.id,
        username: userDTO.username,
        roles: userDTO.roles,
      };
      jest
        .spyOn(mockedJwtService, 'verifyAsync')
        .mockImplementation(async () => decoded);

      const payload = {
        username: userDTO.username,
        sub: userDTO.id,
        roles: userDTO.roles,
      };

      const result = await service.refreshToken(refreshToken);

      expect(service.getAuthToken).toBeCalledWith(payload);
      expect(result).toEqual(authToken);
    });
  });

  describe('getAuthToken', () => {
    const accessTokenExpiry = '1h';
    const refreshTokenExpiry = '1d';
    const user = { id: 5, username: 'username', roles: [ROLE.USER] };

    const payload = {
      username: user.username,
      sub: user.id,
      roles: [ROLE.USER],
    };

    beforeEach(() => {
      jest.spyOn(mockedConfigService, 'get').mockImplementation((key) => {
        let value = null;
        switch (key) {
          case 'jwt.accessTokenExpiresIn':
            value = accessTokenExpiry;
            break;
          case 'jwt.refreshTokenExpiresIn':
            value = refreshTokenExpiry;
            break;
        }
        return value;
      });

      jest
        .spyOn(mockedJwtService, 'signAsync')
        .mockImplementation(async () => 'signed-response');
    });

    it('should generate access token with payload', async () => {
      const result = await service.getAuthToken(payload);

      expect(mockedJwtService.signAsync).toBeCalledWith(payload, {
        expiresIn: accessTokenExpiry,
      });

      expect(result).toMatchObject({
        accessToken: 'signed-response',
      });
    });

    it('should generate refresh token with subject', async () => {
      const result = await service.getAuthToken(payload);
      const subject = { sub: payload.sub };
      expect(mockedJwtService.signAsync).toBeCalledWith(subject, {
        expiresIn: refreshTokenExpiry,
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
