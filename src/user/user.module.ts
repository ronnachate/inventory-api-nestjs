import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { UserStatus } from './entities/user.status.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User, UserStatus])],
  controllers: [UserController],
  providers: [UserService, JwtAuthStrategy, UserRepository],
  exports: [UserService],
})
export class UserModule {}
