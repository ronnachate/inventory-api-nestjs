import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from '../../user/service/user.service';
import { USER_DISABLED_STATUS } from '../../shared/constant/generic';
import { SigninUserDTO } from '../dtos/signin.user.dto';
import { AuthTokenDTO } from '../dtos/auth-token.dto';
import { SigninDTO } from '../dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService
  ) {}

  async validateUser(username: string, pass: string): Promise<SigninUserDTO> {
    const user = await this.userService.validateLoginUser(username, pass);

    // Prevent disabled users from logging in.
    if (user.status.id === USER_DISABLED_STATUS) {
      throw new UnauthorizedException('This user account has been disabled');
    }

    return user;
  }

  async signIn(signInDto: SigninDTO): Promise<AuthTokenDTO> {
    const user = await this.validateUser(
      signInDto.username,
      signInDto.password
    );
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };

    return this.getAuthToken(payload);
  }

  //no validate exist user for refresh token here //TODO
  async refreshToken(refreshToken: string): Promise<AuthTokenDTO> {
    const decoded = await this.jwtService.verifyAsync(refreshToken);
    const payload = {
      sub: decoded.sub,
      username: decoded.username,
      roles: decoded.roles,
    };

    return this.getAuthToken(payload);
  }

  async getAuthToken(payload: any): Promise<AuthTokenDTO> {
    const subject = { sub: payload.sub };
    const authToken = {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('jwt.expiresIn'),
      }),
      refreshToken: await this.jwtService.signAsync(subject, {
        expiresIn: this.configService.get('jwt.expiresIn'),
      }),
    };
    return plainToClass(AuthTokenDTO, authToken, {
      excludeExtraneousValues: true,
    });
  }
}
