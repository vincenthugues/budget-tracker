import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { usePayees } from '../hooks/usePayees';
import { useTransactions } from '../hooks/useTransactions';
import { Account } from '../types/Account';
import { Category } from '../types/Category';
import { Payee } from '../types/Payee';
import { Transaction } from '../types/Transaction';
import { getDisplayFormattedAmount } from '../utils/getDisplayFormattedAmount';
import { getDisplayFormattedDate } from '../utils/getDisplayFormattedDate';
import { getMonthNameFromDate } from '../utils/getMonthNameFromDate';
import { getTransactionYearMonth } from '../utils/getTransactionYearMonth';
import { isSameYearAndMonth } from '../utils/isSameYearAndMonth';
import { SortingOrder, sortByDate } from '../utils/sortByDate';

const filterByYearAndMonth = (
  transactions: Transaction[],
  targetYear: number,
  targetMonth: number
): Transaction[] =>
  transactions.filter(isSameYearAndMonth(targetYear, targetMonth));

const useMonthBudgetData = (): {
  data: {
    accounts: Account[];
    categories: Category[];
    payees: Payee[];
    transactions: Transaction[];
  };
  isLoading: boolean;
  errors: unknown[];
} => {
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

  const errors = [
    accountsError,
    categoriesError,
    payeesError,
    transactionsError,
  ].filter(Boolean);

  const isLoading =
    accountsIsLoading ||
    categoriesIsLoading ||
    payeesIsLoading ||
    transactionsIsLoading;

  return {
    data: {
      accounts,
      categories,
      payees,
      transactions: transactions.length
        ? getSortedLastMonthTransactions(transactions)
        : [],
    },
    isLoading,
    errors,
  };
};

const getSortedLastMonthTransactions = (
  transactions: Transaction[]
): Transaction[] => {
  const sortedTransactions = sortByDate(transactions) as Transaction[];
  const lastTransaction = sortedTransactions[sortedTransactions.length - 1];
  const { year: targetYear, month: targetMonth } =
    getTransactionYearMonth(lastTransaction);
  if (!targetYear || !targetMonth) {
    return [];
  }

  const lastMonthTransactions = filterByYearAndMonth(
    sortedTransactions,
    targetYear,
    targetMonth
  );

  const sortedLastMonthTransactions = sortByDate(
    lastMonthTransactions,
    SortingOrder.DESC
  ) as Transaction[];

  return sortedLastMonthTransactions;
};

const MonthTransactionRow = ({
  transaction: { date, amount, accountId, payeeId, categoryId },
  accounts,
  payees,
  categories,
}: {
  transaction: Transaction;
  accounts: Account[];
  payees: Payee[];
  categories: Category[];
}) => (
  <tr>
    <td>{getDisplayFormattedDate(date)}</td>
    <td>{accounts.find(({ _id }) => _id === accountId)?.name}</td>
    <td>{payees.find(({ _id }) => _id === payeeId)?.name}</td>
    <td>{categories.find(({ _id }) => _id === categoryId)?.name}</td>
    <td>{getDisplayFormattedAmount(amount)}</td>
  </tr>
);

const MonthBudget = (): JSX.Element => {
  const {
    data: { accounts, categories, payees, transactions },
    isLoading,
    errors,
  } = useMonthBudgetData();

  if (errors.length) {
    console.log(`Error(s): ${errors.join('; ')}`);
    return <div>Error when fetching data</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const lastTransaction = transactions.at(-1);
  if (!lastTransaction) {
    return <div>No transactions yet</div>;
  }

  const targetMonthName = getMonthNameFromDate(new Date(lastTransaction.date));
  const { year: targetYear } = getTransactionYearMonth(lastTransaction);

  const totalIncome = transactions.reduce(
    (total, { amount }) => (amount > 0 ? total + amount : total),
    0
  );
  const totalSpending = transactions.reduce(
    (total, { amount }) => (amount < 0 ? total + amount : total),
    0
  );

  return (
    <>
      <h2>
        {targetMonthName} {targetYear}
      </h2>
      <div>Total income: {getDisplayFormattedAmount(totalIncome)}</div>
      <div>Total spending: {getDisplayFormattedAmount(totalSpending)}</div>
      <div>
        Net total: {getDisplayFormattedAmount(totalIncome + totalSpending)}
      </div>
      <table>
        <tbody>
          <tr>
            <th>Date</th>
            <th>Account</th>
            <th>Payee</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
          {transactions.map((transaction) => (
            <MonthTransactionRow
              key={transaction._id}
              transaction={transaction}
              accounts={accounts}
              payees={payees}
              categories={categories}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MonthBudget;
