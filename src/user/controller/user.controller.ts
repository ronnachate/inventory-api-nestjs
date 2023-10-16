import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UserController {
    @Get()
    findAll(): string {
      return 'return all users';
    }

}
