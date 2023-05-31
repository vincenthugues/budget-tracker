import { useFetchedResource } from '../hooks';
import { Account } from '../types/Account';
import { Category } from '../types/Category';
import { Payee } from '../types/Payee';
import { Transaction } from '../types/Transaction';
import { getDisplayFormattedAmount, getDisplayFormattedDate } from '../utils';

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
  const [accounts, accountsIsLoading, accountsErrorMessage] =
    useFetchedResource<Account>('accounts');
  const [categories, categoriesIsLoading, categoriesErrorMessage] =
    useFetchedResource<Category>('categories');
  const [payees, payeesIsLoading, payeesErrorMessage] =
    useFetchedResource<Payee>('payees');
  const [transactions, transactionsIsLoading, transactionsErrorMessage] =
    useFetchedResource<Transaction>('transactions');

  const errorMessages = [
    accountsErrorMessage,
    categoriesErrorMessage,
    payeesErrorMessage,
    transactionsErrorMessage,
  ].filter(Boolean);
  const isLoading =
    accountsIsLoading ||
    categoriesIsLoading ||
    payeesIsLoading ||
    transactionsIsLoading;

  if (errorMessages.length) {
    errorMessages.forEach((errorMessage) => {
      console.log(`Error: ${errorMessage}`);
    });

    return <div>Error when fetching data</div>;
  } else if (isLoading) {
    return <div>Loading...</div>;
  }

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
          {lastMonthTransactions.map(
            ({ _id, date, amount, accountId, payeeId, categoryId }) => (
              <tr key={_id}>
                <td>{getDisplayFormattedDate(date)}</td>
                <td>{accounts.find(({ _id }) => _id === accountId)?.name}</td>
                <td>{payees.find(({ _id }) => _id === payeeId)?.name}</td>
                <td>
                  {categories.find(({ _id }) => _id === categoryId)?.name}
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
