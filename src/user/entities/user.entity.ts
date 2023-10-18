import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Permission } from './permission.entity';
import { UserStatus } from './user.status.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  lastname: string;

  @Unique('username', ['username'])
  @Column({ length: 50 })
  username: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @OneToOne(() => Permission, (permission) => permission.user, {
    eager: true,
  })
  permission: Permission;

  @ManyToOne(() => UserStatus, (status) => status.users, {
    eager: true,
  })
  status: UserStatus;
}
