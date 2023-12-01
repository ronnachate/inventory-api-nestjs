import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SaleOrder } from './sale.order.entity';
import { Product } from '../../product/entities/product.entity';
import { PriceRate } from './price.rate.entity';

@Entity('sale_order_items')
export class SaleOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  //onMenu = 1, custom = 2
  typeId: number;

  //for custom item
  @Column({ length: 150 })
  productName: string;

  quantity: number;

  price: number;

  //product snapshort
  productJson: string;

  //selected option snapshort
  optionJson: string;

  //selected addon snapshort
  addonJson: string;

  @ManyToOne(() => SaleOrder, (order) => order.status)
  order: SaleOrder;

  @ManyToOne(() => Product, (product) => product.saleItems, {
    eager: true,
  })
  product: Product;

  @ManyToOne(() => PriceRate, (rate) => rate.saleItems, {
    eager: true,
  })
  rate: PriceRate | null;

  @Column({ length: 150 })
  note: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
