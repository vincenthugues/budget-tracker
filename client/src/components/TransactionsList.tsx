import { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { usePayees } from '../hooks/usePayees';
import { useResourcesHandler } from '../hooks/useResourcesHandler';
import { useTransactions } from '../hooks/useTransactions';
import { Account } from '../types/Account';
import { Category } from '../types/Category';
import { CreatorInput } from '../types/Creator';
import { Payee } from '../types/Payee';
import { Transaction, TransactionDraft } from '../types/Transaction';
import { getDisplayFormattedAmount } from '../utils/getDisplayFormattedAmount';
import { getDisplayFormattedDate } from '../utils/getDisplayFormattedDate';
import { getInputCurrentDateTime } from '../utils/getInputCurrentDateTime';
import { SortingOrder, sortByDate } from '../utils/sortByDate';
import Creator from './Creator';
import DeleteButton from './DeleteButton';

const TransactionCreator = ({
  onAddTransaction,
}: {
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
    { name: 'accountId', label: 'Account ID', type: 'string' },
    { name: 'payeeId', label: 'Payee ID', type: 'string' },
    {
      name: 'categoryId',
      label: 'Category ID',
      type: 'string',
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

    const response = await fetch('/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        convertTransactionAmountToCents(transactionToCreate)
      ),
    });
    const createdTransaction = await response.json();

    if (createdTransaction.error) {
      console.error(
        `Error (${createdTransaction.statusCode}: ${createdTransaction.error}) while creating the resource: `,
        createdTransaction.message.join(', ')
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
    <Creator
      onSubmit={onSubmit}
      onCancel={onCancel}
      properties={transactionCreatorProperties}
    />;
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

const useTransactionsListsData = () => {
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

function getResourceNameById<T extends { _id: string; name: string }>(
  resources: T[]
) {
  return (resourceId: string): string | undefined =>
    resources.find(({ _id }) => _id === resourceId)?.name;
}

const TransactionsList = (): JSX.Element => {
  const {
    data: { accounts, categories, payees, transactions: fetchedTransactions },
    isLoading,
    errors,
  } = useTransactionsListsData();
  const [transactions, addTransaction, removeTransactionById] =
    useResourcesHandler(fetchedTransactions);
  sortByDate(transactions, SortingOrder.DESC);

  const onDelete = async (transactionId: string) => {
    await fetch(`/transactions/${transactionId}`, {
      method: 'DELETE',
    });
    removeTransactionById(transactionId);
  };

  if (errors.length) {
    console.log(`Error: ${errors.join('; ')}`);
    return <div>Error when fetching data</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getAccountNameById = getResourceNameById<Account>(accounts);
  const getCategoryNameById = getResourceNameById<Category>(categories);
  const getPayeeNameById = getResourceNameById<Payee>(payees);

  return (
    <>
      <TransactionCreator onAddTransaction={addTransaction} />
      <table>
        <tbody>
          <tr>
            <th>Date</th>
            <th>Account</th>
            <th>Category</th>
            <th>Payee</th>
            <th>Amount</th>
            <th>External ID</th>
            <th>Actions</th>
          </tr>
          {transactions.map((transaction) => {
            const {
              _id,
              date,
              amount,
              accountId,
              payeeId,
              categoryId,
              externalId,
            } = transaction;

            const deletionConfirmationMessage = `Delete the transaction "[${getDisplayFormattedDate(
              date
            )}] ${getPayeeNameById(payeeId)} ${getDisplayFormattedAmount(
              amount
            )}"?`;

            return (
              <tr key={_id}>
                <td>{getDisplayFormattedDate(date)}</td>
                <td>{getAccountNameById(accountId)}</td>
                <td>{categoryId && getCategoryNameById(categoryId)}</td>
                <td>{getPayeeNameById(payeeId)}</td>
                <td>{getDisplayFormattedAmount(amount)}</td>
                <td className="ellipsisCell">{externalId}</td>
                <td>
                  <DeleteButton
                    confirmationMessage={deletionConfirmationMessage}
                    onDelete={() => onDelete(_id)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TransactionsList;
