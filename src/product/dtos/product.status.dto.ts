import { Expose } from 'class-transformer';

export class ProductStatusDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  constructor(id: number) {
    this.id = id;
  }
}
