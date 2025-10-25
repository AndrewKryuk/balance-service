import { faker } from '@faker-js/faker/locale/af_ZA';
import { IUserProps } from '@domain/entity-props/user-props.interface';
import { User } from '@domain/entities/user';
import { Money } from '@domain/value-objects/money';

export const generateMockUser = (props: Partial<IUserProps> = {}): User =>
  User.create({
    balance: Money.fromString(
      faker.number
        .float({
          min: 0.01,
          max: 999.99,
          multipleOf: 0.01,
        })
        .toFixed(2),
    ),
    ...props,
  });
