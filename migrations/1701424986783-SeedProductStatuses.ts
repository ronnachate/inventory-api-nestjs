import { MigrationInterface, QueryRunner } from "typeorm"
import { ProductStatus } from "../src/product/entities/product.status.entity";

export class SeedProductStatuses1701424986783 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let statuses: ProductStatus[] = [];
        var statusArray = [
            {
                id : 1,
                name: "Using"
            },
            {
                id : 2,
                name: "Disable"
            },
            {
                id : 3,
                name: "Deleted"
            }
        ];
        for(const data of statusArray) {
            statuses.push(queryRunner.manager.create<ProductStatus>(ProductStatus, {
                id: data.id,
                name: data.name,
              }));
        }
        await queryRunner.manager.save(
            statuses
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE * FROM product_statuses`);
    }

}
