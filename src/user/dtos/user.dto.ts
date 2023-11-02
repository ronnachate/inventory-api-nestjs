import { Expose, Type } from 'class-transformer';
import { UserStatusDTO } from './user.status.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from '../../auth/constant/role.enum';

export class UserDTO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  lastname: string;

  @ApiProperty()
  @Expose()
  username: string;

  @Expose()
  @ApiProperty({ example: [ROLE.USER] })
  roles: ROLE[];

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;

  @ApiProperty()
  @Expose()
  @Type(() => UserStatusDTO)
  status: UserStatusDTO;
}
