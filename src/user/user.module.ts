import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user/user.service';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { UserStatus } from './entities/user.status.entity';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([User, UserStatus, Permission]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
