import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  Headers,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiSecurity,
  ApiResponse,
} from '@nestjs/swagger';
import { XAccessTokenGuard } from '@transport/http/guards/x-access-token.guard';
import { InputValidationPipe } from '@kryuk/ddd-kit/transport/pipes/input-validation.pipe';
import { CreateTransactionUseCaseAbstract } from '@application/abstract/transactions/create-transaction-usecase.abstract';
import { CreateTransactionRequest } from '@transport/http/dto/transactions/create-transaction.request';
import { TransactionReply } from '@transport/http/dto/transactions/transaction.reply';
import { TransactionPresenter } from '@transport/http/presenters/transaction.presenter';

@ApiTags('Transactions')
@ApiSecurity('x-access-token')
@UsePipes(InputValidationPipe)
@UseGuards(XAccessTokenGuard)
@Controller({
  version: '1',
  path: 'transactions',
})
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCaseAbstract,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create transaction' })
  @ApiResponse({
    type: TransactionReply,
  })
  async createTransaction(
    @Body() createTransactionRequest: CreateTransactionRequest,
    @Headers('idempotency-key') idempotencyKey: string,
  ): Promise<TransactionReply> {
    const transaction = await this.createTransactionUseCase.execute({
      ...createTransactionRequest,
      idempotencyKey,
    });

    return {
      result: TransactionPresenter.toResponse(transaction),
    };
  }
}
