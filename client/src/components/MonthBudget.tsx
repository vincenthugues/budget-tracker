import { useState } from 'react';
import { Account } from '../types/Account';
import { Category } from '../types/Category';
import { Goal, GoalType, Month, MonthCategory } from '../types/Month';
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

const getCategoryGoalDisplayInfo = (
  goal: Goal,
  balance: number,
  budgeted: number,
  activity: number
) => {
  const { endMonth, goalType, startMonth, target } = goal;

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

const getChildMonthCategories = (
  parentCategoryId: string,
  monthCategories: MonthCategory[],
  categories: Category[]
) => {
  return monthCategories.filter(({ categoryId }) => {
    const category = categories.find(({ _id }) => _id === categoryId);
    return category?.parentCategoryId === parentCategoryId;
  });
};

const isCategoryDisplayed = (categoryId: string, categories: Category[]) => {
  const category = categories.find(({ _id }) => _id === categoryId);

  return category && !category.isHidden && !category.isDeleted;
};

const CategoryGroupTable = ({
  parentCategoryId,
  categories,
  month,
  totalByCategoryId,
  openModalWithContents,
}: {
  parentCategoryId: Category['_id'];
  categories: Category[];
  month: Month;
  totalByCategoryId: { [categoryId: Category['_id']]: number };
  openModalWithContents: (modalContents: string) => void;
}) => (
  <tbody key={parentCategoryId}>
    <tr>
      <th>{getCategoryName(parentCategoryId, categories)}</th>
    </tr>
    {getChildMonthCategories(
      parentCategoryId,
      month.monthCategories,
      categories
    )
      .filter(({ categoryId }) => isCategoryDisplayed(categoryId, categories))
      .map(({ categoryId, balance, budgeted, activity, goals }) => (
        <tr key={categoryId}>
          <td>{getCategoryName(categoryId, categories)}</td>
          <td>
            -{' '}
            {goals[0] && (
              <button
                onClick={() => {
                  openModalWithContents(
                    getCategoryGoalDisplayInfo(
                      goals[0],
                      balance,
                      budgeted,
                      activity
                    )
                  );
                }}
              >
                Goal info
              </button>
            )}
          </td>
          <td>
            {getDisplayFormattedAmount(totalByCategoryId[categoryId] || 0)}
          </td>
          <td>-</td>
        </tr>
      ))}
  </tbody>
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
  const visibleParentCategories = month.monthCategories.filter(
    ({ categoryId }) => {
      const category = categories.find(({ _id }) => _id === categoryId);
      return (
        category &&
        !category.parentCategoryId &&
        !category.isHidden &&
        !category.isDeleted
      );
    }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContents, setModalContents] = useState('');
  const openModalWithContents = (modalContents: string) => {
    setModalContents(modalContents);
    setIsModalOpen(true);
  };

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
      <dialog open={isModalOpen}>
        <p>{modalContents}</p>
        <button
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          Close
        </button>
      </dialog>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Budgeted</th>
            <th>Activity</th>
            <th>Available</th>
          </tr>
        </thead>
        {visibleParentCategories.map(({ categoryId }) => (
          <CategoryGroupTable
            key={categoryId}
            parentCategoryId={categoryId}
            categories={categories}
            month={month}
            totalByCategoryId={totalByCategoryId}
            openModalWithContents={openModalWithContents}
          />
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
