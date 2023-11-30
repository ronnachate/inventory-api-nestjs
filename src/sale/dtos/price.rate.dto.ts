import { Expose } from 'class-transformer';

export class PriceRateDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  statusId: number;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
