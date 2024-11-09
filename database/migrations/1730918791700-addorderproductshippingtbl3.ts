import { MigrationInterface, QueryRunner } from "typeorm";

export class Addorderproductshippingtbl31730918791700 implements MigrationInterface {
    name = 'Addorderproductshippingtbl31730918791700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shipped"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivered"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "shippingAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deliveredAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deliveredAt"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shippingAt"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivered" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "shipped" TIMESTAMP`);
    }

}
