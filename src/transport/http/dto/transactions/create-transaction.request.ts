import { ApiProperty } from '@nestjs/swagger';
import { ApiPropsToSnakeCase } from '@transport/http/swagger/decorators/api-props-to-snake-case.decorator';
import { ETransactionAction } from '@domain/enums/transaction-action.enum';
import { IsEnum, IsUUID } from 'class-validator';
import { IsPositiveDecimalString } from '@application/validators/is-positive-decimal-string.validator';

@ApiPropsToSnakeCase()
export class CreateTransactionRequest {
  @ApiProperty({
    required: true,
    description: 'User id (UUID)',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    required: true,
    description: 'Action',
    enum: ETransactionAction,
  })
  @IsEnum(ETransactionAction)
  action: ETransactionAction;

  @ApiProperty({
    required: true,
    description: 'Amount',
  })
  @IsPositiveDecimalString()
  amount: string;
}
