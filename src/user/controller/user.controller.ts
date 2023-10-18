import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { LoggerService } from '../../shared/logger/logger.service';
import { UserService } from '../service/user.service';
import { UserDTO } from '../dtos/user.dto';
import { UserPaginationParams } from '../query-params/pagination-params';
import { PaginationResultset } from '../../shared/dtos/pagination-resultset';
import { INTERNAL_SERVER_ERROR_MSG } from '../../shared/constant/generic';

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
    try {
      const { page = 1, rows = 10 } = query;
      const { users, count } = await this.userService.getUsers(
        page,
        rows,
        query.status
      );

      return { items: users, pagination: { page, rows, count } };
    } catch (error) {
      this.logger.error("getUsers error with", query);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: INTERNAL_SERVER_ERROR_MSG,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        }
      );
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<UserDTO> {
    try {
      const user = await this.userService.getUserById(id);
      return user;
    } catch (error) {
      this.logger.error(`getUsers error with id "${id}"`, error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: INTERNAL_SERVER_ERROR_MSG,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        }
      );
    }
  }
}
