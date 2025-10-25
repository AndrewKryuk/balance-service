import { BaseRepositoryAbstract } from '@kryuk/ddd-kit/domain/abstract/repositories/base-repository.abstract';
import { User } from '@domain/entities/user';
import { Nullable } from '@kryuk/ddd-kit/domain/types/nullable';

export abstract class UserRepositoryAbstract extends BaseRepositoryAbstract<User> {
  abstract findOneByIdWithLock(id: string): Promise<Nullable<User>>;
}
