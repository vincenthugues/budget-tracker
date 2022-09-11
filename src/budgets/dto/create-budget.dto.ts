import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly externalId?: string;

  @IsDateString()
  readonly startingDate?: Date;
}
