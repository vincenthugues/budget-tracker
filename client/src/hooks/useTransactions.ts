import { useQuery } from '@tanstack/react-query';
import { Transaction } from '../types/Transaction';

const fetchTransactions = async (): Promise<Transaction[]> => {
  const url = '/transactions';
  const res = await fetch(url);
  const transactions = await res.json();

  return transactions;
};

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
