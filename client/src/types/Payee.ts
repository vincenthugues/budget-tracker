export type PayeeDraft = {
  _id: string;
  name: string;
  externalId?: string;
};

export type Payee = PayeeDraft & { _id: string };
