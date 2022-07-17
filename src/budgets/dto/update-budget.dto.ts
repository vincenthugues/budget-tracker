import { CreateBudgetDto } from './create-budget.dto';

export type UpdateBudgetDto = Partial<
  Pick<CreateBudgetDto, 'name' | 'externalId' | 'startingDate'>
>;
