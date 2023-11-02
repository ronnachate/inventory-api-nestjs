import {
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';

  import { STRATEGY_JWT_AUTH } from '../constant/strategy';
  
  @Injectable()
  export class JwtAuthGuard extends AuthGuard(STRATEGY_JWT_AUTH) {
    handleRequest(err, user, info) {
      if (err || !user) {
        throw err || new UnauthorizedException(`${info}`);
      }
      return user;
    }
  }
  