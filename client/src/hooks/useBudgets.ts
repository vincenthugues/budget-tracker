import { useQuery } from '@tanstack/react-query';
import { fetchBudgets } from '../api';
import { Budget } from '../types/Budget';

export const useBudgets = (): {
  budgets?: Budget[];
  isLoading: boolean;
  error?: unknown;
} => {
  const { data, isLoading, error } = useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: fetchBudgets,
  });

  return { budgets: data, isLoading, error };
};
