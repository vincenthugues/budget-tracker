import { createContext, useEffect, useState } from 'react';
import { Category } from './types/Category';
import { Account } from './types/Account';
import { Payee } from './types/Payee';

export function useFetchedResource<ResourceType>(
  url: string
): [
  fetchedResource: ResourceType[],
  isLoading: boolean,
  errorMessage?: string
] {
  const [items, setItems] = useState<ResourceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    fetch(`/${url}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoading(false);
          setItems(result);
        },
        (error) => {
          setIsLoading(false);
          setErrorMessage(`fetch "${url}": ${error.message}`);
        }
      );
  }, [url]);

  return [items, isLoading, errorMessage];
}

export function useResourcesHandler<T extends { _id: string }>(
  fetchedResources: T[]
): [
  resources: T[],
  addItem: (newItem: T) => void,
  removeItemById: (itemId: string) => void
] {
  const [resources, setResources] = useState<T[]>(fetchedResources);

  useEffect(() => {
    setResources(fetchedResources);
  }, [fetchedResources]);

  const addItem = (newItem: T) => {
    setResources([...resources, newItem]);
  };

  const removeItemById = (itemId: string) => {
    setResources(resources.filter(({ _id }) => _id !== itemId));
  };

  return [resources, addItem, removeItemById];
}

export const CategoriesContext = createContext<{
  categories?: Category[];
  setCategories?: Function;
}>({});

export function useFetchedCategories(): [
  categories?: Category[],
  setCategories?: (categories: Category[]) => void
] {
  const [categories, setCategories] = useState<Category[]>();
  const [fetchedCategories] = useFetchedResource<Category>('categories');

  useEffect(() => {
    setCategories(fetchedCategories);
  }, [fetchedCategories]);

  return [categories, setCategories];
}

export const AccountsContext = createContext<{
  accounts?: Account[];
  setAccounts?: Function;
}>({});

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

export const PayeesContext = createContext<{
  payees?: Payee[];
  setPayees?: Function;
}>({});

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
