import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Product } from './product.entity';
import { PriceRate } from '../../sale/entities/price.rate.entity';

@Entity('product_pricerates')
export class ProductPriceRate {
  @PrimaryGeneratedColumn()
  id: number;

  price: number;

  @ManyToOne(() => Product, (product) => product.options, {
    eager: true,
  })
  product: Product;

  @ManyToOne(() => PriceRate, (product) => product.productPriceRates, {
    eager: true,
  })
  rate: PriceRate;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
