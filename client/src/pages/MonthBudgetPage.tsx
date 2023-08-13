import { MonthBudget } from '../components/MonthBudget';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { usePayees } from '../hooks/usePayees';
import { useTransactions } from '../hooks/useTransactions';
import { Account } from '../types/Account';
import { Category } from '../types/Category';
import { Payee } from '../types/Payee';
import { Transaction } from '../types/Transaction';
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
  const filteredTransactions = transactions.filter(({ payeeId }) => {
    const payee = payees.find(({ _id }) => _id === payeeId);
    const isTransferTransaction = payee?.name.startsWith('Transfer');
    return !isTransferTransaction;
  });
  const sortedFilteredTransactions = filteredTransactions.length
    ? getSortedLastMonthTransactions(filteredTransactions)
    : [];

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
      transactions: sortedFilteredTransactions,
    },
    isLoading,
    errors,
  };
};

const groupTransactionsByCategory = (
  transactions: Transaction[]
): Record<string, Transaction[]> =>
  transactions.reduce((acc: Record<string, Transaction[]>, transaction) => {
    const category: string = transaction.categoryId || '';
    return {
      [category]: [...(acc[category] || []), transaction],
      ...acc,
    };
  }, {});

const getTargetMonthAndYear = (
  transactions: Transaction[]
): [month: string, year: string] => {
  const lastTransaction = transactions.at(-1);
  if (!lastTransaction) {
    const currentYear = new Date().toDateString().split(' ').at(-1) as string;
    const currentMonthName = getMonthNameFromDate(new Date());
    return [currentMonthName, currentYear];
  }

  const targetMonthName = getMonthNameFromDate(new Date(lastTransaction.date));
  const { year: targetYear } = getTransactionYearMonth(lastTransaction);

  return [targetMonthName, targetYear.toString()];
};

export const MonthBudgetPage = (): JSX.Element => {
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

  const [month, year] = getTargetMonthAndYear(transactions);

  const transactionsByCategory = groupTransactionsByCategory(transactions);
  const monthCategories = Object.entries(transactionsByCategory).map(
    ([categoryId, transactions]) => ({
      categoryName: categoryId
        ? categories.find(({ _id }) => _id === categoryId)?.name
        : 'None',
      total: transactions.reduce(
        (total: number, { amount }) => total + amount,
        0
      ),
    })
  );

  const totalIncome = transactions.reduce(
    (total, { amount }) => (amount > 0 ? total + amount : total),
    0
  );
  const totalSpending = transactions.reduce(
    (total, { amount }) => (amount < 0 ? total + amount : total),
    0
  );

  return (
    <MonthBudget
      monthName={month}
      year={year}
      totalIncome={totalIncome}
      totalSpending={totalSpending}
      monthCategories={monthCategories}
      transactions={transactions}
      accounts={accounts}
      payees={payees}
      categories={categories}
    />
  );
};
