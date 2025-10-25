import { Money } from '@domain/value-objects/money';
import { faker } from '@faker-js/faker';

export const generateMockMoney = (amount?: string): Money =>
  Money.fromString(
    amount ??
      faker.number
        .float({
          min: 0.01,
          max: 999.99,
          multipleOf: 0.01,
        })
        .toFixed(2),
  );
