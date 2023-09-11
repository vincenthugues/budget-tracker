import { Account } from '../types/Account';
import { Category } from '../types/Category';
import { Goal, GoalType, Month } from '../types/Month';
import { Payee } from '../types/Payee';
import { Transaction } from '../types/Transaction';
import { getDisplayFormattedAmount } from '../utils/getDisplayFormattedAmount';
import { getDisplayFormattedDate } from '../utils/getDisplayFormattedDate';
import { getMonthNameFromDate } from '../utils/getMonthNameFromDate';

const getCategoryName = (
  categoryId: string,
  categories: Category[]
): string | undefined =>
  categories.find((category) => category._id === categoryId)?.name;

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
    <td>{categoryId && getCategoryName(categoryId, categories)}</td>
    <td>{getDisplayFormattedAmount(amount)}</td>
  </tr>
);

const getCategoryGoalDisplayInfo = (categoryId: string, goals: Goal[]) => {
  const goal = goals.find((monthGoal) => monthGoal.categoryId === categoryId);

  if (!goal || goal.isHidden) return null;

  const {
    activity,
    balance,
    budgeted,
    endMonth,
    goalType,
    startMonth,
    target,
  } = goal;

  return `[${GoalType[goalType]}] ${getDisplayFormattedAmount(
    balance
  )}/${getDisplayFormattedAmount(target)} by end of ${
    getMonthNameFromDate(startMonth) !== getMonthNameFromDate(endMonth)
      ? `${getMonthNameFromDate(endMonth)} (since ${getMonthNameFromDate(
          startMonth
        )})`
      : 'the month'
  }: ${getDisplayFormattedAmount(
    budgeted
  )} this month, activity ${getDisplayFormattedAmount(activity)}`;
};

const groupCategoriesByParentCategoryId = (categories: Category[]) =>
  categories.reduce(
    (acc: Record<Category['_id'], Category['_id'][]>, category: Category) => {
      if (!category.parentCategoryId) {
        return acc;
      }

      return {
        ...acc,
        [category.parentCategoryId]: [
          ...(acc[category.parentCategoryId] || []),
          category._id,
        ],
      };
    },
    {}
  );

export const MonthBudget = ({
  monthName,
  year,
  month,
  totalIncome,
  totalSpending,
  totalByCategoryId,
  transactions,
  accounts,
  payees,
  categories,
}: {
  monthName: string;
  year: string;
  month: Month;
  totalIncome: number;
  totalSpending: number;
  totalByCategoryId: { [categoryId: Category['_id']]: number };
  transactions: Transaction[];
  accounts: Account[];
  payees: Payee[];
  categories: Category[];
}): JSX.Element => {
  const groupedCategoryIds: Record<Category['_id'], Category['_id'][]> =
    groupCategoriesByParentCategoryId(categories);

  return (
    <>
      <h2>
        {monthName} {year}
      </h2>
      <div>
        Income: {getDisplayFormattedAmount(month.income)} - Budgeted:{' '}
        {getDisplayFormattedAmount(month.budgeted || 0)} - To Be Budgeted:{' '}
        {getDisplayFormattedAmount(month.toBeBudgeted || 0)} - Activity{' '}
        {getDisplayFormattedAmount(month.activity || 0)}
      </div>
      <div>Total income: {getDisplayFormattedAmount(totalIncome)}</div>
      <div>
        Total spending: {getDisplayFormattedAmount(Math.abs(totalSpending))}
      </div>
      <div>
        Net total: {getDisplayFormattedAmount(totalIncome + totalSpending)}
      </div>
      <table>
        {Object.entries(groupedCategoryIds)
          .filter(([parentCategoryId]) => {
            const category = categories.find(
              ({ _id }) => _id === parentCategoryId
            );
            return category && !category.isDeleted && !category.isHidden;
          })
          .map(([parentCategoryId, categoryIds]) => (
            <tbody key={parentCategoryId}>
              <tr>
                <th>{getCategoryName(parentCategoryId, categories)}</th>
              </tr>
              {categoryIds
                .map((id) => categories.find(({ _id }) => _id === id)!)
                .filter(({ isHidden, isDeleted }) => !isHidden && !isDeleted)
                .map(({ _id, name }) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{getCategoryGoalDisplayInfo(_id, month.goals)}</td>
                    <td>
                      {getDisplayFormattedAmount(totalByCategoryId[_id] || 0)}
                    </td>
                  </tr>
                ))}
            </tbody>
          ))}
      </table>
      <h3>Month transactions</h3>
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
