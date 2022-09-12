import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePayeeDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsOptional()
  readonly externalId?: string;
}
