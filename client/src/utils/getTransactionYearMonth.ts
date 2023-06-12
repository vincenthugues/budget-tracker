import { Transaction } from '../types/Transaction';

export const getTransactionYearMonth = (
  transaction: Transaction
): { year: number; month: number } => {
  const lastDate = new Date(transaction.date);
  return {
    year: lastDate.getFullYear(),
    month: lastDate.getMonth() + 1,
  };
};
