import { MonthBudget } from '../components/MonthBudget';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { usePayees } from '../hooks/usePayees';
import { useTransactions } from '../hooks/useTransactions';
import { Account } from '../types/Account';
import { Category, DEFAULT_IGNORED_CATEGORIES } from '../types/Category';
import { Goal, GoalType, Month, MonthCategory } from '../types/Month';
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

const sumTransactionAmounts = (
  transactions: Transaction[],
  amountFilter: (amount: number) => boolean
) =>
  transactions.reduce(
    (total, { amount }) => (amountFilter(amount) ? total + amount : total),
    0
  );
const getTotalIncome = (transactions: Transaction[]) =>
  sumTransactionAmounts(transactions, (amount: number) => amount > 0);
const getTotalSpending = (transactions: Transaction[]) =>
  sumTransactionAmounts(transactions, (amount: number) => amount < 0);

const useMonthBudgetData = (): {
  data: {
    accounts: Account[];
    categories: Category[];
    payees: Payee[];
    month: Month;
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
  const categoriesWithEnforcedDefaultHidden = categories.map(
    ({ isHidden, ...category }) => ({
      ...category,
      isHidden: isHidden || DEFAULT_IGNORED_CATEGORIES.includes(category.name),
    })
  );

  const {
    payees = [],
    isLoading: payeesIsLoading,
    error: payeesError,
  } = usePayees();

  const goalsByCategoryId: Record<Category['_id'], Goal> = {
    // Gifts
    '63701d1b61bb3c8261f75ba5': {
      target: 30000,
      goalType: GoalType.BalanceByDate,
      startMonth: new Date('2022-03-01T12:00:00Z'),
      endMonth: new Date('2022-06-01T12:00:00Z'),
    },
    // Health
    '63701d1b61bb3c8261f75b93': {
      target: 12000,
      goalType: GoalType.MinimumBalance,
      startMonth: new Date('2022-03-01T12:00:00Z'),
      endMonth: new Date('2022-03-01T12:00:00Z'),
    },
    // Groceries/food
    '63701d1b61bb3c8261f75b92': {
      goalType: GoalType.MonthlyBudget,
      target: 10000,
      startMonth: new Date('2022-03-01T12:00:00Z'),
      endMonth: new Date('2022-03-01T12:00:00Z'),
    },
  };
  const monthCategories: MonthCategory[] =
    categoriesWithEnforcedDefaultHidden.map(({ _id }) => ({
      categoryId: _id,
      balance: 0,
      activity: 0,
      budgeted: 0,
      goals: goalsByCategoryId[_id] ? [goalsByCategoryId[_id]] : [],
    }));

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

  const [targetMonth, targetYear] = getTargetMonthAndYear(
    sortedFilteredTransactions
  );
  const month: Month = {
    date: new Date(),
    name: targetMonth,
    year: targetYear,
    monthCategories,
    income: getTotalIncome(sortedFilteredTransactions),
    activity: getTotalSpending(sortedFilteredTransactions),
    budgeted: 0,
    toBeBudgeted: 0,
  };

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
      categories: categoriesWithEnforcedDefaultHidden,
      payees,
      month,
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

export const MonthBudgetPage = (): JSX.Element => {
  const {
    data: { accounts, categories, payees, month, transactions },
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

  const transactionsByCategory = groupTransactionsByCategory(transactions);
  const totalByCategoryId = Object.fromEntries(
    Object.entries(transactionsByCategory).map(([categoryId, transactions]) => [
      categoryId,
      transactions.reduce((total: number, { amount }) => total + amount, 0),
    ])
  );

  return (
    <MonthBudget
      month={month}
      totalByCategoryId={totalByCategoryId}
      transactions={transactions}
      accounts={accounts}
      payees={payees}
      categories={categories}
    />
  );
};
