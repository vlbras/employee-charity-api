import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDonationTable1697838768059 implements MigrationInterface {
    name = 'CreateDonationTable1697838768059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "donation" ("id" integer NOT NULL, "date" date NOT NULL, "amount" numeric(13,2) NOT NULL, "employeeId" integer, CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "donation" ADD CONSTRAINT "FK_a90d64bc1d8c672f30b711a942a" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation" DROP CONSTRAINT "FK_a90d64bc1d8c672f30b711a942a"`);
        await queryRunner.query(`DROP TABLE "donation"`);
    }

}
