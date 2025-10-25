import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transactions1761341356397 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS transactions
        (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            action transaction_action NOT NULL,
            amount NUMERIC(21,2) NOT NULL CHECK(amount >= 0.01),
            idempotency_key UUID NOT NULL,
            ts TIMESTAMPTZ NOT NULL DEFAULT now(),
            CONSTRAINT ux_transactions_idempotency UNIQUE(user_id, idempotency_key)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF NOT EXISTS transactions`);
  }
}
