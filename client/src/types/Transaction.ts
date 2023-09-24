export enum TransferType {
  DEBIT = 'Debit',
  CREDIT = 'Credit',
}

export type TransactionDraft = {
  date: Date;
  amount: number;
  transferType: TransferType;
  accountId: string;
  payeeId: string;
  categoryId?: string;
  externalId?: string;
};

export type Transaction = TransactionDraft & { _id: string };
