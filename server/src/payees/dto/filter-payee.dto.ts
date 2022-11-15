import { IsOptional, IsString } from 'class-validator';

export class FilterPayeeDto {
  @IsString()
  @IsOptional()
  readonly externalId?: string;
}
