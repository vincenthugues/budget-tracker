import { IsString } from 'class-validator';

export class ImportDto {
  @IsString()
  readonly resourceName: string;

  @IsString()
  readonly json: string;
}
