import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSale1701419799676 implements MigrationInterface {
    name = 'AddSale1701419799676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sale_order_statuses" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_fe7c27f46ee818aaffc72a63ab0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_order_types" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_2286e38c4daf7debc9e8ac06822" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_orders" ("id" SERIAL NOT NULL, "note" character varying(150) NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "statusId" integer, "typeId" integer, "rateId" integer, CONSTRAINT "PK_ba301b7939d3333e8821ff92637" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_order_items" ("id" SERIAL NOT NULL, "productName" character varying(150) NOT NULL, "note" character varying(150) NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "orderId" integer, "productId" integer, "rateId" integer, CONSTRAINT "PK_6c46724b3d93b4c233ca288871a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "price_rates" ADD "description" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale_orders" ADD CONSTRAINT "FK_f10d0962f9ee1dcdcef1977ed88" FOREIGN KEY ("statusId") REFERENCES "sale_order_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_orders" ADD CONSTRAINT "FK_0cd00b93a6ff8df4ba883fb487e" FOREIGN KEY ("typeId") REFERENCES "sale_order_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_orders" ADD CONSTRAINT "FK_92cd05bf965fb77a6081e44f33b" FOREIGN KEY ("rateId") REFERENCES "price_rates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_order_items" ADD CONSTRAINT "FK_7e86fec28b5baf859f1fc6bfcd9" FOREIGN KEY ("orderId") REFERENCES "sale_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_order_items" ADD CONSTRAINT "FK_1449ab76dc9e3f75a472539904e" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_order_items" ADD CONSTRAINT "FK_1c543aab032d3c534d1bc0b2fec" FOREIGN KEY ("rateId") REFERENCES "price_rates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_order_items" DROP CONSTRAINT "FK_1c543aab032d3c534d1bc0b2fec"`);
        await queryRunner.query(`ALTER TABLE "sale_order_items" DROP CONSTRAINT "FK_1449ab76dc9e3f75a472539904e"`);
        await queryRunner.query(`ALTER TABLE "sale_order_items" DROP CONSTRAINT "FK_7e86fec28b5baf859f1fc6bfcd9"`);
        await queryRunner.query(`ALTER TABLE "sale_orders" DROP CONSTRAINT "FK_92cd05bf965fb77a6081e44f33b"`);
        await queryRunner.query(`ALTER TABLE "sale_orders" DROP CONSTRAINT "FK_0cd00b93a6ff8df4ba883fb487e"`);
        await queryRunner.query(`ALTER TABLE "sale_orders" DROP CONSTRAINT "FK_f10d0962f9ee1dcdcef1977ed88"`);
        await queryRunner.query(`ALTER TABLE "price_rates" DROP COLUMN "description"`);
        await queryRunner.query(`DROP TABLE "sale_order_items"`);
        await queryRunner.query(`DROP TABLE "sale_orders"`);
        await queryRunner.query(`DROP TABLE "sale_order_types"`);
        await queryRunner.query(`DROP TABLE "sale_order_statuses"`);
    }

}
