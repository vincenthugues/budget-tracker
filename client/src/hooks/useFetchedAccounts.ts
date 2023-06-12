import { useEffect, useState } from 'react';
import { Account } from '../types/Account';
import { useFetchedResource } from './useFetchedResource';

export function useFetchedAccounts(): [
  accounts?: Account[],
  setAccounts?: (accounts: Account[]) => void
] {
  const [accounts, setAccounts] = useState<Account[]>();
  const [fetchedAccounts] = useFetchedResource<Account>('accounts');

  useEffect(() => {
    setAccounts(fetchedAccounts);
  }, [fetchedAccounts]);

  return [accounts, setAccounts];
}
