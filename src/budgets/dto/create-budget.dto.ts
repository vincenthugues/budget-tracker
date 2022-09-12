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
  @IsNotEmpty()
  @IsOptional()
  readonly externalId?: string;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  readonly startingDate?: Date;
}
