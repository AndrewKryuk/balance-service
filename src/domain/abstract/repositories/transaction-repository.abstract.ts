import { BaseRepositoryAbstract } from '@kryuk/ddd-kit/domain/abstract/repositories/base-repository.abstract';
import { Transaction } from '@domain/entities/transaction';

export abstract class TransactionRepositoryAbstract extends BaseRepositoryAbstract<Transaction> {}
