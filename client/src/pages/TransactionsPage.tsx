import DeleteButton from '../components/DeleteButton';
import {
  TransactionCreator,
  getResourceNameById,
  useTransactionsListsData,
} from '../components/TransactionsList';
import { useResourcesHandler } from '../hooks/useResourcesHandler';
import { Account } from '../types/Account';
import { Category } from '../types/Category';
import { Payee } from '../types/Payee';
import { Transaction } from '../types/Transaction';
import { getDisplayFormattedAmount } from '../utils/getDisplayFormattedAmount';
import { getDisplayFormattedDate } from '../utils/getDisplayFormattedDate';
import { SortingOrder, sortByDate } from '../utils/sortByDate';

export const TransactionsPage = (): JSX.Element => {
  const {
    data: { accounts, categories, payees, transactions: fetchedTransactions },
    isLoading,
    errors,
  } = useTransactionsListsData();
  const [transactions, addTransaction, removeTransactionById] =
    useResourcesHandler(fetchedTransactions);
  const sortedTransactions = sortByDate(
    transactions,
    SortingOrder.DESC
  ) as Transaction[];

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
      <TransactionCreator
        accounts={accounts}
        payees={payees}
        categories={categories}
        onAddTransaction={addTransaction}
      />
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
          {sortedTransactions.map((transaction) => {
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
