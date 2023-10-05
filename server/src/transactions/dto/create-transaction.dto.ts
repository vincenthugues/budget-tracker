import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransferType } from '../schemas/transaction.schema';

export class CreateTransactionDto {
  @IsDateString()
  @IsNotEmpty()
  readonly date: Date;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  readonly amount: number;

  @IsEnum(TransferType)
  @IsNotEmpty()
  readonly transferType: TransferType;

  @IsMongoId()
  @IsNotEmpty()
  readonly accountId: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly payeeId: string;

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
