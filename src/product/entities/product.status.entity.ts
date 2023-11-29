import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './product.entity';

@Entity('product_statuses')
export class ProductStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Product, (product) => product.status)
  products: Product[];
}
