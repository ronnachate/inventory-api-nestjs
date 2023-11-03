import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { STRATEGY_LOCAL } from '../constant/strategy'

@Injectable()
export class LocalAuthGuard extends AuthGuard(STRATEGY_LOCAL) {}
