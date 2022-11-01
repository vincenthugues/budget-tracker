import { IsOptional, IsString } from 'class-validator';

export class UpdatePayeeDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly externalId?: string;
}
