import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ROLE } from '../constant/role.enum';

export class SigninUserDTO {
    @Expose()
    id: number;
    @Expose()
    username: string;
    @Expose()
    roles: ROLE[];
  }