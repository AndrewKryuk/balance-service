import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Transaction } from '@domain/entities/transaction';
import { ETransactionAction } from '@domain/enums/transaction-action.enum';
import { Money } from '@domain/value-objects/money';
import { BaseTypeOrmEntity } from '@infra/entities/abstract/base-typeorm.entity';

@Entity('transactions')
@Index(['userId', 'idempotencyKey'], { unique: true })
export class TransactionEntity extends BaseTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: ETransactionAction })
  action: ETransactionAction;

  @Column({ type: 'numeric', precision: 21, scale: 2 })
  amount: string;

  @Column({ type: 'uuid' })
  idempotencyKey: string;

  @CreateDateColumn({ type: 'timestamp' })
  ts: Date;

  toDomain(): Transaction {
    return Transaction.create({
      id: this.id,
      userId: this.userId,
      action: this.action,
      amount: Money.fromString(this.amount),
      idempotencyKey: this.idempotencyKey,
      ts: this.ts,
    });
  }

  static fromDomain(transaction: Transaction): TransactionEntity {
    const self = new TransactionEntity();

    self.id = transaction.id;
    self.userId = transaction.userId;
    self.action = transaction.action;
    self.amount = transaction.amount.toString();
    self.idempotencyKey = transaction.idempotencyKey;
    self.ts = transaction.ts;

    return self;
  }
}
