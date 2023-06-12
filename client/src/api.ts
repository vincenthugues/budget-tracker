import { Account, AccountDraft } from './types/Account';
import { Budget, BudgetDraft } from './types/Budget';
import { Category, CategoryDraft } from './types/Category';
import { Payee, PayeeDraft } from './types/Payee';
import { Transaction, TransactionDraft } from './types/Transaction';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  return await response.json();
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: any) =>
    request<T>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
};

export const fetchBudgets = async (): Promise<Budget[]> => {
  const url = '/budgets';
  const budgets = await api.get<Budget[]>(url);

  return budgets;
};

export const createBudget = async (budgetDraft: BudgetDraft): Promise<any> => {
  const url = '/budgets';
  const account = await api.post<Account>(url, budgetDraft);

  return account;
};

export const fetchAccounts = async (): Promise<Account[]> => {
  const url = '/accounts';
  const accounts = await api.get<Account[]>(url);

  return accounts;
};

export const createAccount = async (
  accountDraft: AccountDraft
): Promise<any> => {
  const url = '/accounts';
  const account = await api.post<Account>(url, accountDraft);

  return account;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const url = '/categories';
  const categories = await api.get<Category[]>(url);

  return categories;
};

export const createCategory = async (
  categoryDraft: CategoryDraft
): Promise<any> => {
  const url = '/categories';
  const category = await api.post<Category>(url, categoryDraft);

  return category;
};

export const fetchPayees = async (): Promise<Payee[]> => {
  const url = '/payees';
  const payees = await api.get<Payee[]>(url);

  return payees;
};

export const createPayee = async (payeeDraft: PayeeDraft): Promise<any> => {
  const url = '/payees';
  const payee = await api.post<Payee>(url, payeeDraft);

  return payee;
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const url = '/transactions';
  const transactions = await api.get<Transaction[]>(url);

  return transactions;
};

export const createTransaction = async (
  transactionDraft: TransactionDraft
): Promise<any> => {
  const url = '/transactions';
  const transaction = await api.post<Transaction>(url, transactionDraft);

  return transaction;
};
