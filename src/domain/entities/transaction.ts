import { DomainEntity } from '@kryuk/ddd-kit/domain/base/domain-entity';
import { DefaultOptionalCreateProps } from '@kryuk/ddd-kit/domain/types/default-optional-create-props';
import { ITransactionProps } from '@domain/entity-props/transaction-props.interface';
import { ETransactionAction } from '@domain/enums/transaction-action.enum';
import { Money } from '@domain/value-objects/money';
import Decimal from 'decimal.js';

export class Transaction extends DomainEntity<ITransactionProps> {
  private constructor({
    id,
    ...data
  }: DefaultOptionalCreateProps<ITransactionProps>) {
    super(data as ITransactionProps, id);
  }

  static create(
    transactionProps: DefaultOptionalCreateProps<ITransactionProps>,
  ): Transaction {
    return new Transaction(transactionProps);
  }

  unmarshal(): ITransactionProps {
    const { id, userId, action, amount, idempotencyKey, ts } = this;

    return {
      id,
      userId,
      action,
      amount,
      idempotencyKey,
      ts,
    };
  }

  calcDelta(): Decimal {
    return this.props.action === ETransactionAction.debit
      ? this.props.amount.amount.negated()
      : this.props.amount.amount;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get action(): ETransactionAction {
    return this.props.action;
  }

  get amount(): Money {
    return this.props.amount;
  }

  get idempotencyKey(): string {
    return this.props.idempotencyKey;
  }

  get ts(): Date {
    return this.props.ts;
  }
}
