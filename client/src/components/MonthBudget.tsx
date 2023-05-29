import { useFetchedResource } from '../hooks';
import { getDisplayFormattedAmount, getDisplayFormattedDate } from '../utils';

type TransactionDraft = {
  date: Date;
  amount: number;
  accountId: string;
  payeeId: string;
  categoryId?: string;
};

type Transaction = TransactionDraft & { _id: string };

const MonthBudget = (): JSX.Element => {
  const [transactions, isLoading, errorMessage] =
    useFetchedResource<Transaction>('transactions');

  if (errorMessage) {
    console.log(`Error: ${errorMessage}`);
    return <div>Error when fetching data</div>;
  } else if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <table>
          <tbody>
            <tr>
              <th>Date</th>
              <th>Account</th>
              <th>Category</th>
              <th>Payee</th>
              <th>Amount</th>
            </tr>
            {transactions.map(
              ({ _id, date, amount, accountId, payeeId, categoryId }) => (
                <tr key={_id}>
                  <td>{getDisplayFormattedDate(date)}</td>
                  <td>{accountId}</td>
                  <td>{payeeId}</td>
                  <td>{categoryId}</td>
                  <td>{getDisplayFormattedAmount(amount)}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </>
    );
  }
};

export default MonthBudget;
