import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AccountType } from '../schemas/account.schema';

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly externalId?: string;

  @IsEnum(AccountType)
  @IsOptional()
  readonly type?: AccountType;

  @IsBoolean()
  @IsOptional()
  readonly isClosed?: boolean;

  @IsNumber()
  @IsOptional()
  readonly balance?: number;
}
