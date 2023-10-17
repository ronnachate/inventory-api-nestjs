import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  it('should be defined', () => {
    expect(new LoggerService()).toBeDefined();
  });
});
