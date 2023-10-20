import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStatementTable1697838592809 implements MigrationInterface {
    name = 'CreateStatementTable1697838592809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "statement" ("id" integer NOT NULL, "amount" numeric(13,2) NOT NULL, "date" date NOT NULL, "employeeId" integer, CONSTRAINT "PK_d2ef88cb44b99f3332a1eebb96f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "statement" ADD CONSTRAINT "FK_f80195687aac24adf74297d8bb7" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statement" DROP CONSTRAINT "FK_f80195687aac24adf74297d8bb7"`);
        await queryRunner.query(`DROP TABLE "statement"`);
    }

}
