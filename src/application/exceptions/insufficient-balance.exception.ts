import { ERROR_CODES } from '@domain/constants/error-codes';
import { DomainException } from '@kryuk/ddd-kit/application/exceptions/domain/domain-exception';

export class InsufficientBalanceException extends DomainException {
  constructor(message: string) {
    super([{ message, code: ERROR_CODES.INSUFFICIENT_BALANCE }]);
  }
}
