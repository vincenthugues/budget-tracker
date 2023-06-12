import { createContext } from 'react';
import { Account } from './types/Account';
import { Category } from './types/Category';
import { Payee } from './types/Payee';

export const AccountsContext = createContext<{
  accounts?: Account[];
  setAccounts?: Function;
}>({});

export const CategoriesContext = createContext<{
  categories?: Category[];
  setCategories?: Function;
}>({});

export const PayeesContext = createContext<{
  payees?: Payee[];
  setPayees?: Function;
}>({});
