import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { STRATEGY_JWT_AUTH } from '../constant/strategy';
import { LoginUserDTO } from '../dtos/login.user.dto';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_JWT_AUTH,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.secretKey'),
    });
  }

  async validate(payload: any): Promise<LoginUserDTO> {
    // parse payload to LoginUserDTO
    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
