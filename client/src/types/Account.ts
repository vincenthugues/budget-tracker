export enum AccountType {
  CHECKING = 'Checking',
  SAVINGS = 'Savings',
  OTHER = 'Other',
}

export type AccountDraft = {
  _id: string;
  name: string;
  externalId?: string;
  type?: AccountType;
  isClosed?: boolean;
  balance?: number;
};

export type Account = AccountDraft & { _id: string };
