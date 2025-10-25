import { IsEnum, IsUUID } from 'class-validator';
import { ETransactionAction } from '@domain/enums/transaction-action.enum';
import { IsPositiveDecimalString } from '@application/validators/is-positive-decimal-string.validator';

export class CreateTransactionDTO {
  @IsUUID()
  userId: string;

  @IsEnum(ETransactionAction)
  action: ETransactionAction;

  @IsPositiveDecimalString()
  amount: string;

  @IsUUID()
  idempotencyKey: string;
}
