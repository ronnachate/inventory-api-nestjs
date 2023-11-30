import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductPriceRate } from '../../product/entities/product.pricerate.entity';
import { SaleOrder } from './sale.order.entity';
import { SaleOrderItem } from './sale.order.item.entity';

@Entity('price_rates')
export class PriceRate {
  @PrimaryGeneratedColumn()
  id: number;

  //1 active, 2 deleted
  statusId: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => ProductPriceRate, (productRate) => productRate.rate)
  productPriceRates: ProductPriceRate[];

  @OneToMany(() => SaleOrder, (order) => order.rate)
  orders: SaleOrder[];

  @OneToMany(() => SaleOrderItem, (item) => item.product)
  saleItems: SaleOrderItem[];

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
