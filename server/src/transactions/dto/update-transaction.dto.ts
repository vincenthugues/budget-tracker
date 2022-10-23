import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTransactionDto {
  @IsDateString()
  @IsOptional()
  readonly date?: Date;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly amount?: number;

  @IsMongoId()
  @IsOptional()
  readonly accountId?: string;

  @IsMongoId()
  @IsOptional()
  readonly payeeId?: string;

  @IsMongoId()
  @IsOptional()
  readonly categoryId?: string;

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
