import { CreateTransactionDTO } from '@application/dto/transactions/create-transaction.dto';
import { Transaction } from '@domain/entities/transaction';

/**
 * is used to create transaction
 */
export abstract class CreateTransactionUseCaseAbstract {
  abstract execute(
    createTransactionDTO: CreateTransactionDTO,
  ): Promise<Transaction>;
}
