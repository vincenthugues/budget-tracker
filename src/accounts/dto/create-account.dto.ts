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
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly externalId?: string;

  @IsEnum(AccountType)
  @IsOptional()
  readonly type?: AccountType;

  @IsBoolean()
  readonly isClosed?: boolean;

  @IsNumber()
  readonly balance?: number;
}
