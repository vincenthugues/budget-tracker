import { useQuery } from '@tanstack/react-query';
import { fetchPayees } from '../api';
import { Payee } from '../types/Payee';

export const usePayees = (): {
  payees?: Payee[];
  isLoading: boolean;
  error?: unknown;
} => {
  const { data, isLoading, error } = useQuery<Payee[]>({
    queryKey: ['payees'],
    queryFn: fetchPayees,
  });

  return { payees: data, isLoading, error };
};
