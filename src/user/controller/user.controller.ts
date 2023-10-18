import { Controller, Get, Param, Query } from '@nestjs/common';
import { LoggerService } from 'src/shared/logger/logger.service';
import { UserService } from '../service/user/user.service';
import { UserDTO } from '../dtos/user.dto';
import { UserPaginationParams } from '../query-params/pagination-params';
import { PaginationResultset } from 'src/shared/dtos/pagination-resultset';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(UserController.name);
  }

  @Get()
  async getUsers(
    @Query() query: UserPaginationParams
  ): Promise<PaginationResultset<UserDTO[]>> {
    const { page = 1, rows = 10 } = query;
    const { users, count } = await this.userService.getUsers(page, rows, query.status);

    return { items: users, pagination: { page, rows, count } };
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<UserDTO> {
    const user = await this.userService.getUserById(id);
    return user;
  }
}
