import { Controller, Get, Param } from '@nestjs/common';
import { LoggerService } from 'src/shared/logger/logger.service';
import { UserService } from '../service/user/user.service';
import { UserDTO } from '../dtos/user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(UserController.name);
  }

  @Get()
  findAll(): string {
    return 'return all users';
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<UserDTO> {
    const user = await this.userService.getUserById(id);
    return user;
  }
}
