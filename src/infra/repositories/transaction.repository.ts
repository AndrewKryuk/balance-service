import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '@domain/entities/transaction';
import { BaseTypeOrmRepository } from '@kryuk/ddd-kit/infra/base/base-type-orm.repository';
import { TransactionEntity } from '@infra/entities/transaction.entity';
import { TransactionRepositoryAbstract } from '@domain/abstract/repositories/transaction-repository.abstract';
import { Log } from '@kryuk/ddd-kit/application/decorators/log.decorator';
import { ExistenceException } from '@application/exceptions/existence.exception';
import { TRANSACTION_ERRORS } from '@domain/constants/transactions.constants';

@Injectable()
export class TransactionRepository
  extends BaseTypeOrmRepository<TransactionEntity, Transaction>
  implements TransactionRepositoryAbstract
{
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {
    super(transactionRepository);
  }

  @Log({ level: 'debug' })
  async saveOrFailOnDuplicate(transaction: Transaction): Promise<Transaction> {
    try {
      return await this.save(transaction);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ExistenceException(TRANSACTION_ERRORS.EXISTENCE);
      }

      throw error;
    }
  }
}
