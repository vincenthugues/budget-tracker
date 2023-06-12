import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../api';
import { Transaction } from '../types/Transaction';

export const useTransactions = (): {
  transactions?: Transaction[];
  isLoading: boolean;
  error?: unknown;
} => {
  const { data, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  return { transactions: data, isLoading, error };
};
