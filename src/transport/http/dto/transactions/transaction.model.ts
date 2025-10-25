import { ApiProperty } from '@nestjs/swagger';
import { ApiPropsToSnakeCase } from '@transport/http/swagger/decorators/api-props-to-snake-case.decorator';
import { ETransactionAction } from '@domain/enums/transaction-action.enum';

@ApiPropsToSnakeCase()
export class TransactionModel {
  @ApiProperty({ description: 'Id (UUID)' })
  id: string;

  @ApiProperty({
    description: 'User id (UUID)',
  })
  userId: string;

  @ApiProperty({
    description: 'Действие',
    enum: ETransactionAction,
  })
  action: ETransactionAction;

  @ApiProperty({
    description: 'Сумма',
  })
  amount: string;

  @ApiProperty({
    description: 'Ключ идемпотентности (UUID)',
  })
  idempotencyKey: string;

  @ApiProperty({
    description: 'Дата создания',
  })
  ts: Date;
}
