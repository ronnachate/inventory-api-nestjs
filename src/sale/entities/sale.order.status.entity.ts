import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { SaleOrder } from './sale.order.entity';

@Entity('sale_order_statuses')
export class SaleOrderStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => SaleOrder, (order) => order.status)
  orders: SaleOrder[];
}
