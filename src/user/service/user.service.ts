import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { LoggerService } from '../../shared/logger/logger.service';
import { UserRepository } from '../repositories/user.repository';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserDTO } from '../dtos/user.dto';
import { Equal, Not } from 'typeorm';
import { USER_ACTIVE_STATUS, USER_DELETED_STATUS } from '../../shared/constant/generic';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { UserStatus } from '../entities/user.status.entity';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    private repository: UserRepository,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(UserService.name);
  }

  async getUsers(
    page: number,
    rows: number,
    status?: number
  ): Promise<{ users: UserDTO[]; count: number }> {
    let offset = (page - 1) * rows;
    let filters = {
      where: { status: Not(USER_DELETED_STATUS) },
      take: rows,
      skip: offset,
    };
    if (status) {
      filters.where.status = Equal(status);
    }
    const [users, count] = await this.repository.findAndCount(filters);

    const usersOutput = plainToInstance(UserDTO, users, {
      excludeExtraneousValues: true,
    });

    return { users: usersOutput, count };
  }

  async getUserById(id: number): Promise<UserDTO> {
    const user = await this.repository.getById(id);

    return plainToInstance(UserDTO, user, {
      excludeExtraneousValues: true,
    });
  }

  async createUser(
    input: CreateUserDTO,
  ): Promise<UserDTO> {

    let user = plainToClass(User, input);
    user.passwordHash = await hash(input.password, SALT_ROUNDS);
    user.status = { id: USER_ACTIVE_STATUS } as UserStatus;
    await this.repository.save(user);

    return plainToClass(UserDTO, user, {
      excludeExtraneousValues: true,
    });
  }

  async validateLoginUser(
    username: string,
    pass: string,
  ): Promise<UserDTO> {
    const user = await this.repository.findOne({ where: { username } });
    if (!user || user.status.id == USER_DELETED_STATUS) throw new UnauthorizedException();

    const isValidPassword = await compare(pass, user.passwordHash);
    if (!isValidPassword) throw new UnauthorizedException();

    return plainToClass(UserDTO, user, {
      excludeExtraneousValues: true,
    });
  }

}
