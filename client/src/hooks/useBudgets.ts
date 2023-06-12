import { useQuery } from '@tanstack/react-query';
import { Budget } from '../types/Budget';

const fetchBudgets = async (): Promise<Budget[]> => {
  const url = '/budgets';
  const res = await fetch(url);
  const budgets = await res.json();

  return budgets;
};

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
