import { ETransactionAction } from '@domain/enums/transaction-action.enum';
import { Money } from '@domain/value-objects/money';

export interface ITransactionProps {
  /**
   * ID (UUID)
   */
  id: string;

  /**
   * Reference on user (UUID)
   */
  userId: string;

  /**
   * Transaction action
   */
  action: ETransactionAction;

  /**
   * Transaction amount
   */
  amount: Money;

  /**
   * Idempotency key (UUID)
   */
  idempotencyKey: string;

  /**
   * Created date
   */
  ts: Date;
}
