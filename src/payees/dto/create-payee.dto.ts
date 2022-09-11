import { IsNotEmpty } from 'class-validator';

export class CreatePayeeDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly externalId: string;
}
