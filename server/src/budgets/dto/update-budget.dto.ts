import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateBudgetDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly externalId?: string;

  @IsDateString()
  @IsOptional()
  readonly startingDate?: Date;
}
