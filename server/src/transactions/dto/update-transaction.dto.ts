import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TransferType } from '../schemas/transaction.schema';

export class UpdateTransactionDto {
  @IsDateString()
  @IsOptional()
  readonly date?: Date;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  readonly amount?: number;

  @IsEnum(TransferType)
  @IsNotEmpty()
  @IsOptional()
  readonly transferType?: TransferType;

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
