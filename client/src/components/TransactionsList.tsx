import { useContext, useState } from 'react';
import {
  AccountsContext,
  CategoriesContext,
  PayeesContext,
  useFetchedResource,
  useResourcesHandler,
} from '../hooks';
import { CreatorInput } from '../types/Creator';
import { Transaction, TransactionDraft } from '../types/Transaction';
import {
  Order,
  getDisplayFormattedAmount,
  getDisplayFormattedDate,
  getInputCurrentDateTime,
  sortByDate,
} from '../utils';
import Creator from './Creator';

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

  return (
    <>
      {showCreator ? (
        <Creator
          onSubmit={onSubmit}
          onCancel={onCancel}
          properties={transactionCreatorProperties}
        />
      ) : (
        <button
          onClick={() => {
            setShowCreator(true);
          }}
        >
          ➕
        </button>
      )}
    </>
  );
};

const DeleteTransactionButton = ({
  transaction: { date, amount },
  onDelete,
}: {
  transaction: Transaction;
  onDelete: Function;
}): JSX.Element => (
  <button
    onClick={() => {
      if (window.confirm(`Delete the transaction "[${date}] ${amount}"?`)) {
        onDelete();
      }
    }}
  >
    ❌
  </button>
);

const TransactionsList = (): JSX.Element => {
  const { accounts } = useContext(AccountsContext);
  const { categories } = useContext(CategoriesContext);
  const { payees } = useContext(PayeesContext);
  const [fetchedTransactions, isLoading, errorMessage] =
    useFetchedResource<Transaction>('transactions');
  const [transactions, addTransaction, removeTransactionById] =
    useResourcesHandler(fetchedTransactions);
  sortByDate(transactions, Order.DESC);

  const getAccountNameById = (accountId: string): string | undefined =>
    accounts?.find(({ _id }) => _id === accountId)?.name;
  const getCategoryNameById = (categoryId: string): string | undefined =>
    categories?.find(({ _id }) => _id === categoryId)?.name;
  const getPayeeNameById = (payeeId: string): string | undefined =>
    payees?.find(({ _id }) => _id === payeeId)?.name;

  const onDelete = async (transactionId: string) => {
    await fetch(`/transactions/${transactionId}`, {
      method: 'DELETE',
    });
    removeTransactionById(transactionId);
  };

  if (errorMessage) {
    console.log(`Error: ${errorMessage}`);
    return <div>Error when fetching data</div>;
  } else if (isLoading || !accounts || !categories || !payees) {
    return <div>Loading...</div>;
  } else {
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
              return (
                <tr key={_id}>
                  <td>{getDisplayFormattedDate(date)}</td>
                  <td>{getAccountNameById(accountId)}</td>
                  <td>{categoryId && getCategoryNameById(categoryId)}</td>
                  <td>{getPayeeNameById(payeeId)}</td>
                  <td>{getDisplayFormattedAmount(amount)}</td>
                  <td className="ellipsisCell">{externalId}</td>
                  <td>
                    <DeleteTransactionButton
                      transaction={transaction}
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
  }
};

export default TransactionsList;
