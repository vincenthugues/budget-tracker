import { IsNotEmpty } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly externalId: string;
}
