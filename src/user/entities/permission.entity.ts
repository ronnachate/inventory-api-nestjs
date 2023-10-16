import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('user_permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    isProductAllow: boolean;

    @Column()
    isCategoryAllow: boolean;

    @Column()
    isNewRequestAllow: boolean;

    @Column()
    isHandOverTransactionAllow: boolean;

    @Column()
    isReturnTransactionAllow: boolean;

    @Column()
    isCancelTransactionAllow: boolean;

    @Column()
    isResourceViewAllow: boolean;

    @Column()
    isResourceAdmitAllow: boolean;

    @Column()
    isResourceVerifyAllow: boolean;

    @Column()
    isResourceRepairAllow: boolean;

    @Column()
    isResourceWipeOutAllow: boolean;

    @Column()
    isMemberAllow: boolean;

    @Column()
    isSectorAllow: boolean;

    @Column()
    isUserAllow: boolean;

    @Column()
    isReportAllow: boolean;

    @Column()
    isGenericSettingAllow: boolean;

    @CreateDateColumn({ name: 'createdAt', nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt', nullable: true })
    updatedAt: Date;

    @OneToOne(() => User, (user) => user.permission)
    @JoinColumn()
    user: User;
}
