import { Expose, Type } from 'class-transformer';
import { UserStatusDTO } from './user.status.dto';

export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  name: string;

  @Expose()
  lasname: string;

  @Expose()
  username: string;

  @Expose()
  isAccountDisabled: boolean;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  @Type(() => UserStatusDTO)
  status: UserStatusDTO;
}
