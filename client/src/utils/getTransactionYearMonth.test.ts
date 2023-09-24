import { TransferType } from '../types/Transaction';
import { getTransactionYearMonth } from './getTransactionYearMonth';

describe('getTransactionYearMonth', () => {
  it('returns the year and month for a given transaction', () => {
    const transaction = {
      _id: '',
      amount: 123,
      transferType: TransferType.DEBIT,
      accountId: '',
      payeeId: '',
    };

    expect(
      getTransactionYearMonth({ ...transaction, date: new Date('2023-06-15') })
    ).toEqual({ year: 2023, month: 6 });

    expect(
      getTransactionYearMonth({ ...transaction, date: new Date('2020-01-01') })
    ).toEqual({ year: 2020, month: 1 });
  });
});
