import Decimal from 'decimal.js';

export interface IMoneyProps {
  /**
   * Amount in cents
   */
  amount: Decimal;
}
