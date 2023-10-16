import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('user_statuses')
export class UserStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @OneToMany(() => User, (user) => user.status)
    users: User;
}
