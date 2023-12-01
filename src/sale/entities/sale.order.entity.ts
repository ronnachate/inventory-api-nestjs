import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SaleOrderItem } from './sale.order.item.entity';
import { SaleOrderStatus } from './sale.order.status.entity';
import { PriceRate } from './price.rate.entity';
import { SaleOrderType } from './sale.order.type.entity';

@Entity('sale_orders')
export class SaleOrder {
  @PrimaryGeneratedColumn()
  id: number;

  discount: number | null;

  totalPrice: number;

  isUsingVat: boolean;

  vatRate: number | null;

  vat: number | null;

  isIncludeVat: boolean;

  netPrice: number;

  @OneToMany(() => SaleOrderItem, (item) => item.order, {
    eager: true,
  })
  items: SaleOrderItem[];

  @ManyToOne(() => SaleOrderStatus, (status) => status.orders, {
    eager: true,
  })
  status: SaleOrderStatus;

  @ManyToOne(() => SaleOrderType, (type) => type.orders, {
    eager: true,
  })
  type: SaleOrderType;

  @ManyToOne(() => PriceRate, (rate) => rate.orders, {
    eager: true,
  })
  rate: PriceRate | null;

  @Column({ length: 150 })
  note: string;

  sellerId: number | null;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
