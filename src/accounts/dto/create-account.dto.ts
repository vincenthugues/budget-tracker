import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly externalId?: string;

  @IsString()
  readonly type?: string;

  @IsBoolean()
  readonly isClosed?: boolean;

  @IsNumber()
  readonly balance?: number;
}
