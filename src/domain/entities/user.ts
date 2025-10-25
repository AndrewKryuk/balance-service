import { DomainEntity } from '@kryuk/ddd-kit/domain/base/domain-entity';
import { DefaultOptionalCreateProps } from '@kryuk/ddd-kit/domain/types/default-optional-create-props';
import { IUserProps } from '@domain/entity-props/user-props.interface';
import { Money } from '@domain/value-objects/money';

export class User extends DomainEntity<IUserProps> {
  private constructor({ id, ...data }: DefaultOptionalCreateProps<IUserProps>) {
    super(data as IUserProps, id);
  }

  static create(userProps: DefaultOptionalCreateProps<IUserProps>): User {
    return new User(userProps);
  }

  unmarshal(): IUserProps {
    const { id, balance } = this;

    return {
      id,
      balance,
    };
  }

  updateBalance(balance: Money): void {
    this.props.balance = balance;
  }

  get id(): string {
    return this._id;
  }

  get balance(): Money {
    return this.props.balance;
  }
}
