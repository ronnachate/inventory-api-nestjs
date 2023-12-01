import { Expose } from 'class-transformer';

export class SaleOrderTypeDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  constructor(id: number) {
    this.id = id;
  }
}
