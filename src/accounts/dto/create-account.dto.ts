import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AccountType } from '../schemas/account.schema';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
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
