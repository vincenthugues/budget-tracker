import { CreateBudgetDto } from './create-budget.dto';

export type UpdateBudgetDto = Pick<CreateBudgetDto, 'name' | 'externalId'>;
