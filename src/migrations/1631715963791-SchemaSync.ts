import {MigrationInterface, QueryRunner} from "typeorm";

export class SchemaSync1631715963791 implements MigrationInterface {
    name = 'SchemaSync1631715963791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."coffee" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."coffee" DROP COLUMN "description"`);
    }

}
