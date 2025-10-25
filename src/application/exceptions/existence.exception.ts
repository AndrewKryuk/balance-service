import { ERROR_CODES } from '@domain/constants/error-codes';
import { ConflictException } from '@kryuk/ddd-kit/application/exceptions/domain/conflict-exception';

export class ExistenceException extends ConflictException {
  constructor(message: string) {
    super([{ message, code: ERROR_CODES.EXISTENCE }]);
  }
}
