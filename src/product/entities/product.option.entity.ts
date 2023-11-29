import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductOptionItem } from './product.option.item.entity';
import { Product } from './product.entity';

@Entity('product_options')
export class ProductOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => ProductOptionItem, (item) => item.option)
  items: ProductOptionItem[];

  @ManyToOne(() => Product, (product) => product.options, {
    eager: true,
  })
  product: Product;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
