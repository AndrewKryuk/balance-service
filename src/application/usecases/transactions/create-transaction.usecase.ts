import { Injectable } from '@nestjs/common';
import { Log } from '@kryuk/ddd-kit/application/decorators/log.decorator';
import { DTO } from '@kryuk/ddd-kit/application/validation/decorators/dto.decorator';
import { Transaction } from '@domain/entities/transaction';
import { validateDTO } from '@kryuk/ddd-kit/application/validation/decorators/validate-dto.decorator';
import { CreateTransactionUseCaseAbstract } from '@application/abstract/transactions/create-transaction-usecase.abstract';
import { CreateTransactionDTO } from '@application/dto/transactions/create-transaction.dto';
import { UserRepositoryAbstract } from '@domain/abstract/repositories/user-repository.abstract';
import { TransactionRepositoryAbstract } from '@domain/abstract/repositories/transaction-repository.abstract';
import { TransactionServiceAbstract } from '@kryuk/ddd-kit/domain/abstract/services/transaction-service.abstract';
import { NotFoundException } from '@application/exceptions/not-found.exception';
import { USER_ERRORS } from '@domain/constants/users.constants';
import { InsufficientBalanceException } from '@application/exceptions/insufficient-balance.exception';
import { Money } from '@domain/value-objects/money';

@Injectable()
export class CreateTransactionUseCase
  implements CreateTransactionUseCaseAbstract
{
  constructor(
    private readonly userRepository: UserRepositoryAbstract,
    private readonly transactionRepository: TransactionRepositoryAbstract,
    private readonly transactionService: TransactionServiceAbstract,
  ) {}

  @Log({ level: 'debug' })
  @validateDTO()
  async execute(
    @DTO() { userId, action, amount, idempotencyKey }: CreateTransactionDTO,
  ): Promise<Transaction> {
    const transaction = Transaction.create({
      userId,
      action,
      amount: Money.fromString(amount),
      idempotencyKey,
      ts: new Date(),
    });

    return this.transactionService.withTransaction(async () => {
      const updatedRows = await this.userRepository.atomicUpdateBalance(
        userId,
        transaction.calcDelta(),
      );

      if (updatedRows === 0) {
        const userExists = await this.userRepository.exists(userId);

        if (!userExists) {
          throw new NotFoundException(USER_ERRORS.NOT_FOUND);
        }

        throw new InsufficientBalanceException(
          USER_ERRORS.INSUFFICIENT_BALANCE,
        );
      }

      return this.transactionRepository.saveOrFailOnDuplicate(transaction);
    });
  }
}
