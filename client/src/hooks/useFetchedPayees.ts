import { useEffect, useState } from 'react';
import { Payee } from '../types/Payee';
import { useFetchedResource } from './useFetchedResource';

export function useFetchedPayees(): [
  payees?: Payee[],
  setPayees?: (payees: Payee[]) => void
] {
  const [payees, setPayees] = useState<Payee[]>();
  const [fetchedPayees] = useFetchedResource<Payee>('payees');

  useEffect(() => {
    setPayees(fetchedPayees);
  }, [fetchedPayees]);

  return [payees, setPayees];
}
