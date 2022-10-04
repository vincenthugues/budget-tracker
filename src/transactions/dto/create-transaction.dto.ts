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
import { Types } from 'mongoose';

export class CreateTransactionDto {
  @IsDateString()
  @IsNotEmpty()
  readonly date: Date;

  @IsNumber()
  @Type(() => Number)
  readonly amount: number;

  @IsMongoId()
  @IsNotEmpty()
  readonly account: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  readonly payee: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  readonly category: Types.ObjectId;

  @IsBoolean()
  @IsOptional()
  readonly isCleared?: Boolean;

  @IsBoolean()
  @IsOptional()
  readonly isDeleted?: Boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly externalId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly notes?: string;
}
