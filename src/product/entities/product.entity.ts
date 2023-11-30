import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { ProductStatus } from './product.status.entity';
import { ProductOption } from './product.option.entity';
import { Category } from './category.entity';
import { ProductAddon } from './product.addon.entity';
import { SaleOrderItem } from '../../sale/entities/sale.order.item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique('name', ['name'])
  @Column({ length: 150 })
  name: string;

  @Column({ length: 255 })
  description: string;

  price: number;

  @Column({ length: 100 })
  imagePath: string;

  @OneToMany(() => ProductOption, (option) => option.product)
  options: ProductOption[];

  @OneToMany(() => ProductAddon, (addon) => addon.product)
  addons: ProductAddon[];

  @ManyToOne(() => ProductStatus, (status) => status.products, {
    eager: true,
  })
  status: ProductStatus;

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
  })
  category: Category;

  @OneToMany(() => SaleOrderItem, (item) => item.product)
  saleItems: SaleOrderItem[];

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
