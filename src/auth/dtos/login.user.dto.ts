import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ROLE } from '../../auth/constant/role.enum';

export class LoginUserDTO {
    @Expose()
    id: number;
    @Expose()
    username: string;
    @Expose()
    roles: ROLE[];
  }