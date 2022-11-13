import { IsOptional, IsString } from 'class-validator';

export class FilterCategoryDto {
  @IsString()
  @IsOptional()
  readonly externalId?: string;
}
