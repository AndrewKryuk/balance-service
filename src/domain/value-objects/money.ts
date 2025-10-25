import { ValueObject } from '@kryuk/ddd-kit/domain/base/value-object';
import { IMoneyProps } from '@domain/value-object-props/money-props.interface';
import Decimal from 'decimal.js';

export class Money extends ValueObject<IMoneyProps> {
  private constructor(moneyProps: IMoneyProps) {
    super(moneyProps);
  }

  static fromDecimal(value: Decimal): Money {
    return new Money({ amount: value });
  }

  static fromString(value: string): Money {
    return new Money({ amount: new Decimal(value) });
  }

  get amount(): Decimal {
    return this.props.amount;
  }

  toString(): string {
    return this.amount.toFixed(2);
  }
}
