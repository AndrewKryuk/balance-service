import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionAction1761340968404 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE transaction_action AS ENUM ('debit', 'credit');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE transaction_action;`);
  }
}
