export type CategoryDraft = {
  _id: string;
  name: string;
  parentCategoryId?: string;
  isHidden?: boolean;
  isDeleted?: boolean;
  externalId?: string;
};

export type Category = CategoryDraft & { _id: string };
