export const DEFAULT_IGNORED_CATEGORIES = [
  'Hidden Categories',
  'Credit Card Payments',
  'Internal Master Category',
  'Deferred Income SubCategory',
  'Uncategorized',
];

export type CategoryDraft = {
  _id: string;
  name: string;
  parentCategoryId?: string;
  isHidden?: boolean;
  isDeleted?: boolean;
  externalId?: string;
};

export type Category = CategoryDraft & { _id: string };
