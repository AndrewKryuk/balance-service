import { Transaction } from '@domain/entities/transaction';

export class TransactionPresenter {
  static toResponse(transaction: Transaction) {
    const { amount, ...props } = transaction.unmarshal();

    return {
      ...props,
      amount: amount.toString(),
    };
  }
}
