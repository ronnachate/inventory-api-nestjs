import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique('categoryName', ['name'])
  @Column({ length: 150 })
  name: string;

  @Column({ length: 255 })
  description: string;

  //using =1, deleted = 2
  statusId: number;

  @OneToMany(() => Product, (product) => product.status)
  products: Product[];

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
