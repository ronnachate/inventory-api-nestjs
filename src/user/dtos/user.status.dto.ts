import { Expose } from 'class-transformer';

export class UserStatusDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  constructor(id: number) {
    this.id = id;
  }
}
