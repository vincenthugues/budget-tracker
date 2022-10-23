import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly externalId?: string;

  @IsDateString()
  @IsOptional()
  readonly startingDate?: Date;
}
