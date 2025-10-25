import { Provider } from '@nestjs/common';
import { ValidateAccessTokenUseCaseAbstract } from '@application/abstract/access-token/validate-access-token-usecase.abstract';
import { ValidateAccessTokenUseCase } from '@application/usecases/access-token/validate-access-token.usecase';
import { CreateTransactionUseCaseAbstract } from '@application/abstract/transactions/create-transaction-usecase.abstract';
import { CreateTransactionUseCase } from '@application/usecases/transactions/create-transaction.usecase';

export const transactionUseCasesProviders: Provider[] = [
  {
    provide: CreateTransactionUseCaseAbstract,
    useClass: CreateTransactionUseCase,
  },
];

export const accessTokenUseCasesProviders: Provider[] = [
  {
    provide: ValidateAccessTokenUseCaseAbstract,
    useClass: ValidateAccessTokenUseCase,
  },
];

export const useCasesProviders: Provider[] = [
  ...transactionUseCasesProviders,
  ...accessTokenUseCasesProviders,
];
