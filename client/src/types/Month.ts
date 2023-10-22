export enum GoalType {
  BalanceByDate, // One-time bills & expenses, vacation fund, medium- and long-term projects/expenses...
  MonthlyBudget, // Rent, utilities, food or hobby budget, expense category to limit...
  MinimumBalance, // Emergency fund, unexpected expense fund...
}

export type Goal = {
  goalType: GoalType;
  target: number;
  startMonth: Date;
  endMonth: Date;
};

export type MonthCategory = {
  categoryId: string;
  budgeted: number;
  activity: number;
  balance: number;
  goals: Goal[];
};

export type Month = {
  date: Date;
  name: string;
  year: string;
  income: number;
  budgeted: number;
  toBeBudgeted: number;
  activity: number;
  monthCategories: MonthCategory[];
};
