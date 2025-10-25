import { Provider } from '@nestjs/common';
import { TransactionRepository } from '@infra/repositories/transaction.repository';
import { TransactionRepositoryAbstract } from '@domain/abstract/repositories/transaction-repository.abstract';
import { UserRepositoryAbstract } from '@domain/abstract/repositories/user-repository.abstract';
import { UserRepository } from '@infra/repositories/user.repository';

export const repositoriesProviders: Provider[] = [
  {
    provide: TransactionRepositoryAbstract,
    useClass: TransactionRepository,
  },
  {
    provide: UserRepositoryAbstract,
    useClass: UserRepository,
  },
];
