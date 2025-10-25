import { BaseRepositoryAbstract } from '@kryuk/ddd-kit/domain/abstract/repositories/base-repository.abstract';
import { User } from '@domain/entities/user';
import Decimal from 'decimal.js';

export abstract class UserRepositoryAbstract extends BaseRepositoryAbstract<User> {
  abstract atomicUpdateBalance(userId: string, delta: Decimal): Promise<number>;
}
