import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsDateString()
  @IsNotEmpty()
  readonly date: Date;

  @IsNumber()
  @Type(() => Number)
  readonly amount: number;

  @IsMongoId()
  @IsNotEmpty()
  readonly accountId: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly payeeId: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly categoryId: string;

  @IsBoolean()
  @IsOptional()
  readonly isCleared?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isDeleted?: boolean;

  @IsString()
  @IsOptional()
  readonly externalId?: string;

  @IsString()
  @IsOptional()
  readonly notes?: string;
}
