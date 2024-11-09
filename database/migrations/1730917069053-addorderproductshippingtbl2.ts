import { MigrationInterface, QueryRunner } from "typeorm";

export class Addorderproductshippingtbl21730917069053 implements MigrationInterface {
    name = 'Addorderproductshippingtbl21730917069053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shippings" ADD "phone" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shippings" DROP COLUMN "phone"`);
    }

}
