import { MigrationInterface, QueryRunner } from "typeorm"

import { UserStatus } from "../src/user/entities/user.status.entity";

export class SeedUserStatus1699011166871 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let statuses: UserStatus[] = [];
        var statusArray = [
            {
                id : 1,
                name: "Active"
            },
            {
                id : 2,
                name: "Inactive"
            },
            {
                id : 3,
                name: "Deleted"
            }
        ];
        for(const data of statusArray) {
            statuses.push(queryRunner.manager.create<UserStatus>(UserStatus, {
                id: data.id,
                name: data.name,
              }));
        }
        const createdStatused = await queryRunner.manager.save(
            statuses
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE * FROM user_statuses`);
    }

}
