import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { InputValidationException } from '@kryuk/ddd-kit/application/exceptions/transport/input-validation-exception';
import { ERROR_CODES } from '@kryuk/ddd-kit/domain/constants/error-codes';
import { TransactionServiceAbstract } from '@kryuk/ddd-kit/domain/abstract/services/transaction-service.abstract';
import { UserRepositoryAbstract } from '@domain/abstract/repositories/user-repository.abstract';
import { TransactionRepositoryAbstract } from '@domain/abstract/repositories/transaction-repository.abstract';
import { CreateTransactionUseCaseAbstract } from '@application/abstract/transactions/create-transaction-usecase.abstract';
import { CreateTransactionUseCase } from '@application/usecases/transactions/create-transaction.usecase';
import { CreateTransactionDTO } from '@application/dto/transactions/create-transaction.dto';
import { ETransactionAction } from '@domain/enums/transaction-action.enum';
import { NotFoundException } from '@application/exceptions/not-found.exception';
import { USER_ERRORS } from '@domain/constants/users.constants';
import { generateMockUser } from '@application/__tests__/__mocks__/generate-mock-user';
import { Money } from '@domain/value-objects/money';
import { InsufficientBalanceException } from '@application/exceptions/insufficient-balance.exception';
import { Transaction } from '@domain/entities/transaction';
import { generateMockTransaction } from '@application/__tests__/__mocks__/generate-mock-transaction';
import { generateMockMoney } from '@application/__tests__/__mocks__/generate-mock-money';

describe('Create Transaction Use Case', () => {
  let userRepository: UserRepositoryAbstract;
  let transactionRepository: TransactionRepositoryAbstract;
  let transactionService: TransactionServiceAbstract;
  let createTransactionUseCase: CreateTransactionUseCaseAbstract;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: TransactionServiceAbstract,
          useValue: {
            withTransaction: jest
              .fn()
              .mockImplementation(async (callback: <T = any>() => Promise<T>) =>
                callback(),
              ),
          },
        },
        {
          provide: UserRepositoryAbstract,
          useValue: {
            findOneByIdWithLock: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: TransactionRepositoryAbstract,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: CreateTransactionUseCaseAbstract,
          useClass: CreateTransactionUseCase,
        },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepositoryAbstract>(
      UserRepositoryAbstract,
    );
    transactionRepository = moduleRef.get<TransactionRepositoryAbstract>(
      TransactionRepositoryAbstract,
    );
    transactionService = moduleRef.get<TransactionServiceAbstract>(
      TransactionServiceAbstract,
    );
    createTransactionUseCase = moduleRef.get<CreateTransactionUseCaseAbstract>(
      CreateTransactionUseCaseAbstract,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw an exception if empty dto is provided', async () => {
    const createTransactionDTO = {};

    await expect(
      createTransactionUseCase.execute(createTransactionDTO as any),
    ).rejects.toEqual(
      new InputValidationException([
        {
          message: 'userId must be a UUID',
          code: ERROR_CODES.INVALID_INPUT,
        },
        {
          message: 'action must be one of the following values: debit, credit',
          code: ERROR_CODES.INVALID_INPUT,
        },
        {
          message: 'amount must be a positive decimal number greater than 0',
          code: ERROR_CODES.INVALID_INPUT,
        },
        {
          message: 'idempotencyKey must be a UUID',
          code: ERROR_CODES.INVALID_INPUT,
        },
      ]),
    );
  });

  it('should throw an exception if incorrect dto is provided', async () => {
    const createTransactionDTO: CreateTransactionDTO = {
      userId: NaN as any,
      action: NaN as any,
      amount: NaN as any,
      idempotencyKey: NaN as any,
    };

    await expect(
      createTransactionUseCase.execute(createTransactionDTO),
    ).rejects.toEqual(
      new InputValidationException([
        {
          message: 'userId must be a UUID',
          code: ERROR_CODES.INVALID_INPUT,
        },
        {
          message: 'action must be one of the following values: debit, credit',
          code: ERROR_CODES.INVALID_INPUT,
        },
        {
          message: 'amount must be a positive decimal number greater than 0',
          code: ERROR_CODES.INVALID_INPUT,
        },
        {
          message: 'idempotencyKey must be a UUID',
          code: ERROR_CODES.INVALID_INPUT,
        },
      ]),
    );
  });

  it('should throw exception if user is not found', async () => {
    const createTransactionDTO: CreateTransactionDTO = {
      userId: faker.string.uuid(),
      action: ETransactionAction.debit,
      amount: faker.number
        .float({
          min: 0.01,
          max: 999.99,
          multipleOf: 0.01,
        })
        .toFixed(2),
      idempotencyKey: faker.string.uuid(),
    };

    const findOneByIdWithLockSpy = jest
      .spyOn(userRepository, 'findOneByIdWithLock')
      .mockResolvedValue(null);

    await expect(
      createTransactionUseCase.execute(createTransactionDTO),
    ).rejects.toEqual(new NotFoundException(USER_ERRORS.NOT_FOUND));

    expect(findOneByIdWithLockSpy).toHaveBeenCalledWith(
      createTransactionDTO.userId,
    );
  });

  it('should throw exception if user balance is negative', async () => {
    const createTransactionDTO: CreateTransactionDTO = {
      userId: faker.string.uuid(),
      action: ETransactionAction.debit,
      amount: '1',
      idempotencyKey: faker.string.uuid(),
    };

    const userMock = generateMockUser({
      balance: Money.fromString('0.01'),
    });

    jest
      .spyOn(userRepository, 'findOneByIdWithLock')
      .mockResolvedValue(userMock);

    await expect(
      createTransactionUseCase.execute(createTransactionDTO),
    ).rejects.toEqual(
      new InsufficientBalanceException(USER_ERRORS.INSUFFICIENT_BALANCE),
    );
  });

  it('should call execute() without exceptions', async () => {
    jest.useFakeTimers();

    const createTransactionDTO: CreateTransactionDTO = {
      userId: faker.string.uuid(),
      action: faker.helpers.arrayElement(Object.values(ETransactionAction)),
      amount: '0.01',
      idempotencyKey: faker.string.uuid(),
    };

    const userMock = generateMockUser({
      balance: Money.fromString('1'),
    });
    const transactionMock = generateMockTransaction({
      userId: userMock.id,
      action: createTransactionDTO.action,
      amount: Money.fromString(createTransactionDTO.amount),
    });
    const moneyMock = generateMockMoney();

    jest
      .spyOn(userRepository, 'findOneByIdWithLock')
      .mockResolvedValue(userMock);
    const withTransactionSpy = jest.spyOn(
      transactionService,
      'withTransaction',
    );
    const moneyFromStringSpy = jest.spyOn(Money, 'fromString');
    const transactionCreateSpy = jest
      .spyOn(Transaction, 'create')
      .mockReturnValue(transactionMock);
    const subtractSpy = jest
      .spyOn(userMock.balance, 'subtract')
      .mockReturnValue(moneyMock);
    const addSpy = jest
      .spyOn(userMock.balance, 'add')
      .mockReturnValue(moneyMock);
    const moneyIsNegativeSpy = jest.spyOn(Money.prototype, 'isNegative');
    const updateBalanceSpy = jest.spyOn(userMock, 'updateBalance');
    const transactionSaveSpy = jest.spyOn(transactionRepository, 'save');
    const userSaveSpy = jest.spyOn(userRepository, 'save');

    await expect(
      createTransactionUseCase.execute(createTransactionDTO),
    ).resolves.toBe(transactionMock);

    expect(withTransactionSpy).toHaveBeenCalled();
    expect(moneyFromStringSpy).toHaveBeenCalledWith(
      createTransactionDTO.amount,
    );
    expect(transactionCreateSpy).toHaveBeenCalledWith({
      userId: createTransactionDTO.userId,
      action: createTransactionDTO.action,
      amount: Money.fromString(createTransactionDTO.amount),
      idempotencyKey: createTransactionDTO.idempotencyKey,
      ts: new Date(),
    });

    if (createTransactionDTO.action === ETransactionAction.debit) {
      expect(subtractSpy).toHaveBeenCalledWith(transactionMock.amount);
      expect(addSpy).not.toHaveBeenCalled();
    } else {
      expect(addSpy).toHaveBeenCalledWith(transactionMock.amount);
      expect(subtractSpy).not.toHaveBeenCalled();
    }

    expect(moneyIsNegativeSpy).toHaveBeenCalled();
    expect(updateBalanceSpy).toHaveBeenCalledWith(moneyMock);
    expect(transactionSaveSpy).toHaveBeenCalledWith(transactionMock);
    expect(userSaveSpy).toHaveBeenCalledWith(userMock);
  });
});
