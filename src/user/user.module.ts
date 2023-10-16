import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user/user.service';
import { User } from './entities/user.entity';
import { UserStatus } from './entities/user.status.entity';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserStatus, Permission])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
