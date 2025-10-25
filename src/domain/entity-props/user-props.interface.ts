import { Money } from '@domain/value-objects/money';

export interface IUserProps {
  /**
   * UUID
   */
  id: string;

  /**
   * Balance
   */
  balance: Money;
}
