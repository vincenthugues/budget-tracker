import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { usePayees } from '../hooks/usePayees';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types/Transaction';
import { getDisplayFormattedAmount } from '../utils/getDisplayFormattedAmount';
import { getDisplayFormattedDate } from '../utils/getDisplayFormattedDate';
import { SortingOrder, sortByDate } from '../utils/sortByDate';

const getLastTransactionYearMonth = (
  transactions: Transaction[]
): [year: number, month: number] | [] => {
  if (!transactions?.length) return [];

  const lastTransaction = transactions[transactions.length - 1];
  const lastDate = new Date(lastTransaction.date);
  return [lastDate.getFullYear(), lastDate.getMonth() + 1];
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
  const {
    accounts,
    isLoading: accountsIsLoading,
    error: accountsError,
  } = useAccounts();
  const {
    categories,
    isLoading: categoriesIsLoading,
    error: categoriesError,
  } = useCategories();
  const {
    payees,
    isLoading: payeesIsLoading,
    error: payeesError,
  } = usePayees();
  const {
    transactions,
    isLoading: transactionsIsLoading,
    error: transactionsError,
  } = useTransactions();

  const errors = [
    accountsError,
    categoriesError,
    payeesError,
    transactionsError,
  ].filter(Boolean);
  if (errors.length) {
    console.log(`Error(s): ${errors.join('; ')}`);
    return <div>Error when fetching data</div>;
  }

  const isLoading =
    accountsIsLoading ||
    categoriesIsLoading ||
    payeesIsLoading ||
    transactionsIsLoading;
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const sortedTransactions = sortByDate(transactions || []) as Transaction[];
  const [targetYear, targetMonth] =
    getLastTransactionYearMonth(sortedTransactions);
  const lastMonthTransactions =
    targetYear && targetMonth
      ? filterByYearAndMonth(sortedTransactions, targetYear, targetMonth)
      : [];
  const sortedLastMonthTransactions = sortByDate(
    lastMonthTransactions,
    SortingOrder.DESC
  ) as Transaction[];
  const targetMonthName = lastMonthTransactions[0]
    ? getMonthNameFromDate(new Date(lastMonthTransactions[0].date))
    : null;

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
            <th>Payee</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
          {sortedLastMonthTransactions.map(
            ({ _id, date, amount, accountId, payeeId, categoryId }) => (
              <tr key={_id}>
                <td>{getDisplayFormattedDate(date)}</td>
                <td>{accounts?.find(({ _id }) => _id === accountId)?.name}</td>
                <td>{payees?.find(({ _id }) => _id === payeeId)?.name}</td>
                <td>
                  {categories?.find(({ _id }) => _id === categoryId)?.name}
                </td>
                <td>{getDisplayFormattedAmount(amount)}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
};

export default MonthBudget;
