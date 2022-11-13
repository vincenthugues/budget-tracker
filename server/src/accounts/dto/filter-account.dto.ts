import { IsOptional, IsString } from 'class-validator';

export class FilterAccountDto {
  @IsString()
  @IsOptional()
  readonly externalId?: string;
}
