import { IsOptional, IsString } from 'class-validator';

export class FilterTransactionDto {
  @IsString()
  @IsOptional()
  readonly externalId?: string;
}
