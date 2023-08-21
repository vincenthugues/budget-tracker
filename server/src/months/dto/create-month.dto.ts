import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMonthDto {
  @IsDateString()
  @IsNotEmpty()
  readonly monthDate: Date;

  @IsBoolean()
  readonly isDeleted: boolean;

  @IsNumber()
  readonly income: number;

  // goals

  @IsString()
  @IsOptional()
  readonly externalId?: string;
}
