import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRelated1697471426410 implements MigrationInterface {
    name = 'AddUserRelated1697471426410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_permissions" ("id" SERIAL NOT NULL, "isProductAllow" boolean NOT NULL, "isCategoryAllow" boolean NOT NULL, "isNewRequestAllow" boolean NOT NULL, "isHandOverTransactionAllow" boolean NOT NULL, "isReturnTransactionAllow" boolean NOT NULL, "isCancelTransactionAllow" boolean NOT NULL, "isResourceViewAllow" boolean NOT NULL, "isResourceAdmitAllow" boolean NOT NULL, "isResourceVerifyAllow" boolean NOT NULL, "isResourceRepairAllow" boolean NOT NULL, "isResourceWipeOutAllow" boolean NOT NULL, "isMemberAllow" boolean NOT NULL, "isSectorAllow" boolean NOT NULL, "isUserAllow" boolean NOT NULL, "isReportAllow" boolean NOT NULL, "isGenericSettingAllow" boolean NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "userId" integer, CONSTRAINT "REL_f05ccc7935f14874d7f89ba030" UNIQUE ("userId"), CONSTRAINT "PK_01f4295968ba33d73926684264f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_statuses" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_50cc8fb0f4810b2f3bfcef7a788" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "title" character varying(50), "name" character varying(100) NOT NULL, "lastname" character varying(100), "username" character varying(50) NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "statusId" integer, CONSTRAINT "username" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_permissions" ADD CONSTRAINT "FK_f05ccc7935f14874d7f89ba030f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fffa7945e50138103659f6326b7" FOREIGN KEY ("statusId") REFERENCES "user_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fffa7945e50138103659f6326b7"`);
        await queryRunner.query(`ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_f05ccc7935f14874d7f89ba030f"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_statuses"`);
        await queryRunner.query(`DROP TABLE "user_permissions"`);
    }

}
