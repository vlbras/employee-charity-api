import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeeTable1697838462051 implements MigrationInterface {
    name = 'CreateEmployeeTable1697838462051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee" ("id" integer NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, "departmentId" integer, CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_9ad20e4029f9458b6eed0b0c454" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_9ad20e4029f9458b6eed0b0c454"`);
        await queryRunner.query(`DROP TABLE "employee"`);
    }

}
