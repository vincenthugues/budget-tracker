import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePayeeDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly externalId?: string;
}
