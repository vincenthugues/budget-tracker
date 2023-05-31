export type BudgetDraft = {
  name: string;
  externalId?: string;
  startingDate?: Date;
};

export type Budget = BudgetDraft & { _id: string };
