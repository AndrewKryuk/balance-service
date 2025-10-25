import { TransactionModel } from './transaction.model';
import { ApiPropsToSnakeCase } from '@transport/http/swagger/decorators/api-props-to-snake-case.decorator';
import { ResultReply } from '@kryuk/ddd-kit/application/dto/common/result.reply';

@ApiPropsToSnakeCase()
export class TransactionReply extends ResultReply(TransactionModel, {
  description: 'Транзакция',
}) {}
