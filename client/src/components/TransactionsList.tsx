import { useState } from 'react';
import { createTransaction } from '../api';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { usePayees } from '../hooks/usePayees';
import { useTransactions } from '../hooks/useTransactions';
import { Account } from '../types/Account';
import { Category, DEFAULT_IGNORED_CATEGORIES } from '../types/Category';
import { CreatorInput } from '../types/Creator';
import { Payee } from '../types/Payee';
import { Transaction, TransactionDraft } from '../types/Transaction';
import { getInputCurrentDateTime } from '../utils/getInputCurrentDateTime';
import Creator from './Creator';

export const TransactionCreator = ({
  accounts,
  payees,
  categories,
  onAddTransaction,
}: {
  accounts: Account[];
  payees: Payee[];
  categories: Category[];
  onAddTransaction: (transaction: Transaction) => void;
}) => {
  const [showCreator, setShowCreator] = useState(false);

  const transactionCreatorProperties: CreatorInput[] = [
    {
      name: 'date',
      label: 'Date',
      type: 'datetime-local',
      defaultValue: getInputCurrentDateTime(),
    },
    { name: 'amount', label: 'Amount', type: 'number' },
    {
      name: 'accountId',
      label: 'Account',
      type: 'string',
      options: accounts.map(({ _id, name }) => [_id, name]),
    },
    {
      name: 'payeeId',
      label: 'Payee',
      type: 'string',
      options: payees.map(({ _id, name }) => [_id, name]),
    },
    {
      name: 'categoryId',
      label: 'Category',
      type: 'string',
      options: categories
        .filter(
          ({ name, parentCategoryId, isDeleted }) =>
            !!parentCategoryId &&
            !DEFAULT_IGNORED_CATEGORIES.includes(name) &&
            !isDeleted
        )
        .map(({ _id, name }) => [_id, name]),
      isOptional: true,
    },
  ];

  const onSubmit = async (transactionToCreate: TransactionDraft) => {
    const convertTransactionAmountToCents = ({
      amount,
      ...otherProperties
    }: TransactionDraft): TransactionDraft => ({
      amount: amount * 100,
      ...otherProperties,
    });

    const createdTransaction = await createTransaction(
      convertTransactionAmountToCents(transactionToCreate)
    );

    if (createdTransaction.message) {
      console.error(
        `Error ${createdTransaction.statusCode} while creating the resource: ${createdTransaction.message}`
      );
      return;
    }

    onAddTransaction(createdTransaction);
    setShowCreator(false);
  };

  const onCancel = () => {
    setShowCreator(false);
  };

  if (showCreator) {
    return (
      <Creator
        onSubmit={onSubmit}
        onCancel={onCancel}
        properties={transactionCreatorProperties}
      />
    );
  }

  return (
    <button
      onClick={() => {
        setShowCreator(true);
      }}
    >
      ➕
    </button>
  );
};

export const useTransactionsListsData = () => {
  const {
    accounts = [],
    isLoading: accountsIsLoading,
    error: accountsError,
  } = useAccounts();
  const {
    categories = [],
    isLoading: categoriesIsLoading,
    error: categoriesError,
  } = useCategories();
  const {
    payees = [],
    isLoading: payeesIsLoading,
    error: payeesError,
  } = usePayees();
  const {
    transactions = [],
    isLoading: transactionsIsLoading,
    error: transactionsError,
  } = useTransactions();

  const isLoading =
    accountsIsLoading ||
    categoriesIsLoading ||
    payeesIsLoading ||
    transactionsIsLoading;

  const errors = [
    accountsError,
    categoriesError,
    payeesError,
    transactionsError,
  ].filter(Boolean);

  return {
    data: { accounts, categories, payees, transactions },
    isLoading,
    errors,
  };
};

export function getResourceNameById<T extends { _id: string; name: string }>(
  resources: T[]
) {
  return (resourceId: string): string | undefined =>
    resources.find(({ _id }) => _id === resourceId)?.name;
}
