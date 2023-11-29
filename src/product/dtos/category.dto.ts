import { Expose } from 'class-transformer';

export class CategoryDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  statusId: number;

  constructor(name: string) {
    this.name = name;
  }
}
