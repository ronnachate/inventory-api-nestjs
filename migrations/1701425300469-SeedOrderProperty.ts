import { SaleOrderType } from '../src/sale/entities/sale.order.type.entity';
import { SaleOrderStatus } from '../src/sale/entities/sale.order.status.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOrderProperty1701425300469 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.seedOrderStatuses(queryRunner);
    await this.seedOrderTypes(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM sale_order_statuses`);
    await queryRunner.query(`DELETE * FROM sale_order_types`);
  }

  private async seedOrderStatuses(queryRunner: QueryRunner): Promise<void> {
    let statuses: SaleOrderStatus[] = [];
    var statusArray = [
      {
        id: 1,
        name: 'Queued',
      },
      {
        id: 2,
        name: 'Processing',
      },
      {
        id: 3,
        name: 'Eating',
      },
      {
        id: 4,
        name: 'Billing',
      },
      {
        id: 5,
        name: 'Finished',
      },
      {
        id: 6,
        name: 'Canceled',
      },
    ];
    for (const data of statusArray) {
      statuses.push(
        queryRunner.manager.create<SaleOrderStatus>(SaleOrderStatus, {
          id: data.id,
          name: data.name,
        })
      );
    }
    await queryRunner.manager.save(statuses);
  }

  private async seedOrderTypes(queryRunner: QueryRunner): Promise<void> {
    let types: SaleOrderType[] = [];
    var typeArray = [
      {
        id: 1,
        name: 'AtStore',
      },
      {
        id: 2,
        name: 'SelfPickup',
      },
      {
        id: 3,
        name: 'Delivery',
      },
    ];
    for (const data of typeArray) {
      types.push(
        queryRunner.manager.create<SaleOrderType>(SaleOrderType, {
          id: data.id,
          name: data.name,
        })
      );
    }
    await queryRunner.manager.save(types);
  }
}
