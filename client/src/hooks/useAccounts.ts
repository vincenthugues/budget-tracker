import { useQuery } from '@tanstack/react-query';
import { fetchAccounts } from '../api';
import { Account } from '../types/Account';

export const useAccounts = (): {
  accounts?: Account[];
  isLoading: boolean;
  error?: unknown;
} => {
  const { data, isLoading, error } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  });

  return { accounts: data, isLoading, error };
};
