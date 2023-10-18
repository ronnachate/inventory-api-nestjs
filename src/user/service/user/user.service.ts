import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/logger/logger.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from 'src/user/dtos/user.dto';

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
    rows: number
  ): Promise<{ users: UserDTO[]; count: number }> {
    let offset = (page - 1) * rows;
    const [users, count] = await this.repository.findAndCount({
      where: {},
      take: rows,
      skip: offset,
    });

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
