import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoggerService } from '../../shared/logger/logger.service';
import { UserService } from '../service/user.service';
import { UserDTO } from '../dtos/user.dto';
import { UserPaginationParams } from '../query-params/pagination-params';
import { PaginationResultset } from '../../shared/dtos/pagination-resultset';
import { INTERNAL_SERVER_ERROR_MSG } from '../../shared/constant/generic';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from '../dtos/create-user.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ROLE } from '../../auth/constant/role.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';

@ApiTags('users')
@Controller('v1/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(UserController.name);
  }

  @Get()
  @ApiOperation({
    summary: 'Get users with pagination',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginationResultset<UserDTO[]>,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @Roles(ROLE.ADMIN)
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
      this.logger.error('getUsers error with', query);
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
  @ApiOperation({
    summary: 'Get user by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @Roles(ROLE.ADMIN)
  async getUser(@Param('id') id: string): Promise<UserDTO> {
    try {
      const user = await this.userService.getUserById(id);
      return user;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          }
        );
      } else {
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

  @Post()
  @ApiOperation({
    summary: 'Create new user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @Roles(ROLE.ADMIN)
  async createUser(@Body() input: CreateUserDTO): Promise<UserDTO> {
    try {
      const user = await this.userService.createUser(input);
      return user;
    } catch (error) {
      this.logger.error('create user error with', { input, error });
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
