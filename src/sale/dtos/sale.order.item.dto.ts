import { Expose } from 'class-transformer';
import { PriceRateDTO } from './price.rate.dto';

export class SaleOrderItemDTO {
  @Expose()
  id: number;

  @Expose()
  typeId: number;

  @Expose()
  productName: string;

  @Expose()
  quantity: number;

  @Expose()
  price: number;

  //product snapshort
  @Expose()
  productJson: string;

  //selected option snapshort
  @Expose()
  optionJson: string;

  //selected addon snapshort
  @Expose()
  addonJson: string;

  @Expose()
  rate: PriceRateDTO | null;

  @Expose()
  note: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
