import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { UserStatus } from './user.status.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, nullable: true })
  lastname: string;

  @Unique('username', ['username'])
  @Column({ length: 50 })
  username: string;

  @Column()
  passwordHash: string;

  @Column('simple-array')
  roles: string[];

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => UserStatus, (status) => status.users, {
    eager: true,
  })
  status: UserStatus;
}
