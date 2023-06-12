import { useQuery } from '@tanstack/react-query';
import { Account } from '../types/Account';

const fetchAccounts = async (): Promise<Account[]> => {
  const url = '/accounts';
  const res = await fetch(url);
  const accounts = await res.json();

  return accounts;
};

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
