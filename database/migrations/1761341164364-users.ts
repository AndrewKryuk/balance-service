import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1761341164364 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS users
        (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          balance NUMERIC(21,2) NOT NULL DEFAULT 0 CHECK (balance >= 0)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
