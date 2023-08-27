import { Account } from '../types/Account';
import { Category } from '../types/Category';
import { GoalType, Month } from '../types/Month';
import { Payee } from '../types/Payee';
import { Transaction } from '../types/Transaction';
import { getDisplayFormattedAmount } from '../utils/getDisplayFormattedAmount';
import { getDisplayFormattedDate } from '../utils/getDisplayFormattedDate';
import { getMonthNameFromDate } from '../utils/getMonthNameFromDate';

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

export const MonthBudget = ({
  monthName,
  year,
  month,
  totalIncome,
  totalSpending,
  monthCategories,
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
  monthCategories: { categoryName: string | undefined; total: number }[];
  transactions: Transaction[];
  accounts: Account[];
  payees: Payee[];
  categories: Category[];
}): JSX.Element => (
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
    <div>
      Goals
      {month.goals.map(
        ({
          categoryId,
          balance,
          activity,
          budgeted,
          goalType,
          startMonth,
          endMonth,
          target,
        }) => (
          <div>
            {categories.find(({ _id }) => _id === categoryId)?.name} (
            {GoalType[goalType]} - {getDisplayFormattedAmount(target)} between{' '}
            {getMonthNameFromDate(startMonth)} and{' '}
            {getMonthNameFromDate(endMonth)}): Balance{' '}
            {getDisplayFormattedAmount(balance)} (
            {getDisplayFormattedAmount(budgeted)} this month) - Activity{' '}
            {getDisplayFormattedAmount(activity)} - Goal Type - Start Month{' '}
          </div>
        )
      )}
    </div>
    <h3>Categories</h3>
    <table>
      <tbody>
        <tr>
          <th>Category</th>
          <th>Total</th>
        </tr>
        {monthCategories.map(({ categoryName, total }) => (
          <tr key={categoryName}>
            <td>{categoryName}</td>
            <td>{getDisplayFormattedAmount(total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <h3>Transactions</h3>
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
