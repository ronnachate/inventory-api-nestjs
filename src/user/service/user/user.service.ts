import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/logger/logger.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import { plainToClass } from 'class-transformer';
import { UserDTO } from 'src/user/dtos/user.dto';

@Injectable()
export class UserService {
    constructor(
        private repository: UserRepository,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext(UserService.name);
    }

    async getUserById(id: number): Promise<UserDTO> {
        const user = await this.repository.getById(id);
    
        return plainToClass(UserDTO, user, {
          excludeExtraneousValues: true,
        });
    }
    
}
