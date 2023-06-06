export type TransactionDraft = {
  date: Date;
  amount: number;
  accountId: string;
  payeeId: string;
  categoryId?: string;
  externalId?: string;
};

export type Transaction = TransactionDraft & { _id: string };
