import { IsString } from 'class-validator';

export class ImportDto {
  @IsString()
  readonly resourceName: string;

  @IsString()
  readonly json: string;
}

export type BudgetImportDto = {
  readonly id: string;
  readonly name: string;
  readonly first_month: string;
};

export type AccountImportDto = {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly balance: number;
  readonly closed: boolean;
};

export type CategoryImportDto = {
  readonly id: string;
  readonly name: string;
  readonly hidden: boolean;
  readonly deleted: boolean;
};

export type CategoryGroupImportDto = CategoryImportDto & {
  readonly categories: CategoryImportDto[];
};

export type PayeeImportDto = {
  readonly id: string;
  readonly name: string;
};

export type TransactionImportDto = {
  readonly id: string;
  readonly date: string;
  readonly amount: number;
  readonly account_id: string;
  readonly payee_id: string;
  readonly category_id: string;
  readonly memo: string;
  readonly approved: boolean;
  readonly deleted: boolean;
};
