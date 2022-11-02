import { IsOptional, IsString } from 'class-validator';

export class FilterBudgetDto {
  @IsString()
  @IsOptional()
  readonly externalId?: string;
}
