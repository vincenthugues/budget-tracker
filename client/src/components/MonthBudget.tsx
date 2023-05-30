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

const getLastTransactionYearMonth = (
  transactions: Transaction[]
): [year: number, month: number] | [] => {
  if (!transactions?.length) return [];

  const lastTransaction = transactions[transactions.length - 1];
  const lastDate = new Date(lastTransaction.date);
  return [lastDate.getFullYear(), lastDate.getMonth() + 1];
};

const sortByDate = (
  arr: { date: Date | string }[]
): { date: Date | string }[] => {
  arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return arr;
};

const filterByYearAndMonth = (
  transactions: Transaction[],
  targetYear: number,
  targetMonth: number
) =>
  transactions.filter(({ date }) => {
    const [year, month] = new Date(date).toISOString().split('-');
    return Number(year) === targetYear && Number(month) === targetMonth;
  });

const getMonthNameFromDate = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};

const MonthBudget = (): JSX.Element => {
  const [transactions, isLoading, errorMessage] =
    useFetchedResource<Transaction>('transactions');
  sortByDate(transactions);

  const [targetYear, targetMonth] = getLastTransactionYearMonth(transactions);
  const lastMonthTransactions =
    targetYear && targetMonth
      ? filterByYearAndMonth(transactions, targetYear, targetMonth)
      : [];
  sortByDate(lastMonthTransactions);
  const targetMonthName = lastMonthTransactions[0]
    ? getMonthNameFromDate(new Date(lastMonthTransactions[0].date))
    : null;

  if (errorMessage) {
    console.log(`Error: ${errorMessage}`);
    return <div>Error when fetching data</div>;
  } else if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <h2>
          {targetMonthName} {targetYear}
        </h2>
        <table>
          <tbody>
            <tr>
              <th>Date</th>
              <th>Account</th>
              <th>Category</th>
              <th>Payee</th>
              <th>Amount</th>
            </tr>
            {lastMonthTransactions.map(
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
