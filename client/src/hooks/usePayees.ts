import { useQuery } from '@tanstack/react-query';
import { Payee } from '../types/Payee';

const fetchPayees = async (): Promise<Payee[]> => {
  const url = '/payees';
  const res = await fetch(url);
  const payees = await res.json();

  return payees;
};

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
