import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProduct1701419510214 implements MigrationInterface {
    name = 'AddProduct1701419510214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_statuses" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_d82b6ccd4f16a294aa02b285703" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_option_items" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "optionId" integer, CONSTRAINT "PK_5690afd66c717171715034427cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_options" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "productId" integer, CONSTRAINT "PK_3916b02fb43aa725f8167c718e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_addons" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "productId" integer, CONSTRAINT "PK_c909c66608157a4304cf090dcab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "description" character varying(255) NOT NULL, "imagePath" character varying(100) NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "statusId" integer, "categoryId" integer, CONSTRAINT "productName" UNIQUE ("name"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "description" character varying(255) NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "categoryName" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "price_rates" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_a5d135dd6edf91e5cb5f0abe09b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_pricerates" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "productId" integer, "rateId" integer, CONSTRAINT "PK_bc239de14c21966c5a9f3dc4034" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "product_option_items" ADD CONSTRAINT "FK_29d0ee62384aa64f146074f6fcf" FOREIGN KEY ("optionId") REFERENCES "product_options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_options" ADD CONSTRAINT "FK_96d8f73d05e681974c07b99ee5d" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_addons" ADD CONSTRAINT "FK_a2a9df582b310423e7bf7c0304e" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_7058d9b9023bdc9defdaff50509" FOREIGN KEY ("statusId") REFERENCES "product_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_pricerates" ADD CONSTRAINT "FK_c73dc27a8158cf3365df49ab093" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_pricerates" ADD CONSTRAINT "FK_78a197855ddbdd9ab822b548083" FOREIGN KEY ("rateId") REFERENCES "price_rates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_pricerates" DROP CONSTRAINT "FK_78a197855ddbdd9ab822b548083"`);
        await queryRunner.query(`ALTER TABLE "product_pricerates" DROP CONSTRAINT "FK_c73dc27a8158cf3365df49ab093"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_7058d9b9023bdc9defdaff50509"`);
        await queryRunner.query(`ALTER TABLE "product_addons" DROP CONSTRAINT "FK_a2a9df582b310423e7bf7c0304e"`);
        await queryRunner.query(`ALTER TABLE "product_options" DROP CONSTRAINT "FK_96d8f73d05e681974c07b99ee5d"`);
        await queryRunner.query(`ALTER TABLE "product_option_items" DROP CONSTRAINT "FK_29d0ee62384aa64f146074f6fcf"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "title" character varying(50)`);
        await queryRunner.query(`DROP TABLE "product_pricerates"`);
        await queryRunner.query(`DROP TABLE "price_rates"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "product_addons"`);
        await queryRunner.query(`DROP TABLE "product_options"`);
        await queryRunner.query(`DROP TABLE "product_option_items"`);
        await queryRunner.query(`DROP TABLE "product_statuses"`);
    }

}
