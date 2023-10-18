import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../shared/logger/logger.service';
import { UserRepository } from '../repositories/user.repository';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from '../dtos/user.dto';
import { Equal, Not } from 'typeorm';
import { USER_DELETED_STATUS } from '../../shared/constant/generic';

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
    status: number
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
}
