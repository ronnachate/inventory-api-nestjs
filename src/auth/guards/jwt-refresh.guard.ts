import {
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  
  import { STRATEGY_JWT_REFRESH } from '../constant/strategy';
  
  @Injectable()
  export class JwtRefreshGuard extends AuthGuard(STRATEGY_JWT_REFRESH) {
    handleRequest(err, user, info) {
      if (err || !user) {
        throw err || new UnauthorizedException(`${info}`);
      }
      return user;
    }
  }
  