import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import Decimal from 'decimal.js';

export const IsPositiveDecimalString = (
  validationOptions?: ValidationOptions,
) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPositiveDecimalString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          try {
            const decimal = new Decimal(value);
            return decimal.gt(0);
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a positive decimal number greater than 0`;
        },
      },
    });
  };
};
