export enum GoalType {
  BalanceByDate, // One-time bills & expenses, vacation fund, medium- and long-term projects/expenses...
  MonthlyBudget, // Rent, utilities, food or hobby budget, expense category to limit...
  MinimumBalance, // Emergency fund, unexpected expense fund...
}

export type Goal = {
  categoryId: string;
  goalType: GoalType;
  target: number;
  budgeted: number;
  activity: number;
  balance: number;
  isHidden: boolean;
  startMonth: Date;
  endMonth: Date;
};

export type Month = {
  monthDate: Date;
  income: number;
  goals: Goal[];
  budgeted?: number;
  toBeBudgeted?: number;
  activity?: number;
};
