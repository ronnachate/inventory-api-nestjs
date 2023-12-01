import { Expose } from 'class-transformer';
import { SaleOrderStatusDTO } from './sale.order.status.dto';
import { SaleOrderTypeDTO } from './sale.order.type.dto';
import { PriceRateDTO } from './price.rate.dto';
import { SaleOrderItemDTO } from './sale.order.item.dto';

export class SaleOrderDTO {
  @Expose()
  id: number;

  @Expose()
  discount: number | null;

  @Expose()
  totalPrice: number;

  @Expose()
  isUsingVat: boolean;

  @Expose()
  vatRate: number | null;

  @Expose()
  vat: number | null;

  @Expose()
  isIncludeVat: boolean;

  @Expose()
  netPrice: number;

  @Expose()
  items: SaleOrderItemDTO[];

  @Expose()
  status: SaleOrderStatusDTO;

  @Expose()
  type: SaleOrderTypeDTO;

  @Expose()
  rate: PriceRateDTO | null;

  @Expose()
  note: string;

  @Expose()
  sellerId: number | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
