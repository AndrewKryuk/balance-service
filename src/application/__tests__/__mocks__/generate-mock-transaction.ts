import { faker } from '@faker-js/faker/locale/af_ZA';
import { Money } from '@domain/value-objects/money';
import { ITransactionProps } from '@domain/entity-props/transaction-props.interface';
import { Transaction } from '@domain/entities/transaction';
import { ETransactionAction } from '@domain/enums/transaction-action.enum';

export const generateMockTransaction = (
  props: Partial<ITransactionProps> = {},
): Transaction =>
  Transaction.create({
    userId: faker.string.uuid(),
    action: faker.helpers.arrayElement(Object.values(ETransactionAction)),
    amount: Money.fromString(
      faker.number
        .float({
          min: 0.01,
          max: 999.99,
          multipleOf: 0.01,
        })
        .toFixed(2),
    ),
    idempotencyKey: faker.string.uuid(),
    ts: new Date(),
    ...props,
  });
