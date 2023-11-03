import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';

import { STRATEGY_LOCAL } from '../constant/strategy';
import { AuthService } from '../services/auth.service';
import { SigninUserDTO } from '../dtos/signin.user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, STRATEGY_LOCAL) {
  constructor(
    private authService: AuthService,
  ) {
    // Add option passReqToCallback: true to configure strategy to be request-scoped.
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    username: string,
    password: string,
  ): Promise<SigninUserDTO> {

    const user = await this.authService.validateUser(username, password);
    return user;
  }
}
