import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { SigninDTO } from '../dtos/signin.dto';
import { AuthTokenDTO } from '../dtos/auth-token.dto';
import { AuthService } from '../services/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDTO } from '../dtos/refresh-token.dto';

describe('AuthController', () => {
  let authController: AuthController;
  const mockedAuthService = {
    signIn: jest.fn(() => null),
    refreshToken: jest.fn(() => null),
  };
  const authToken: AuthTokenDTO = {
    accessToken: 'random_access_token',
    refreshToken: 'random_refresh_token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockedAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signin', () => {
    const signinDto: SigninDTO = {
      username: 'john@doe.com',
      password: '1234',
    };
    it('should signin user', async () => {
      jest
        .spyOn(mockedAuthService, 'signIn')
        .mockImplementation(async () => authToken);

      expect(await authController.signin(signinDto)).toEqual(authToken);
    });

    it('should return UnauthorizedException when signin is invalid', async () => {
      jest
        .spyOn(mockedAuthService, 'signIn')
        .mockRejectedValue(new UnauthorizedException());

      try {
        await authController.signin(signinDto);
      } catch (error) {
        expect(error.constructor).toBe(UnauthorizedException);
      }
    });
  });

  describe('refreshToken', () => {
    let refreshTokenInputDto: RefreshTokenDTO = {
      refreshToken: 'refresh_token',
    };
    let authToken: AuthTokenDTO = {
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    };

    it('should generate refresh token', async () => {
      jest
      .spyOn(mockedAuthService, 'refreshToken')
      .mockImplementation(async () => authToken);

      const response = await authController.refreshToken(
        refreshTokenInputDto,
      );

      expect(mockedAuthService.refreshToken).toBeCalledWith(refreshTokenInputDto.refreshToken);
      expect(response).toEqual(authToken);
    });

    it('should return unauthorized exception when refresh token failed', async () => {
      jest
        .spyOn(mockedAuthService, 'refreshToken')
        .mockRejectedValue(new UnauthorizedException());

      try {
        await authController.refreshToken(refreshTokenInputDto);
      } catch (error) {
        expect(error.constructor).toBe(UnauthorizedException);
      }
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
