import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsBoolean()
  readonly isDeleted?: boolean;

  @IsString()
  @IsOptional()
  readonly externalId?: string;

  @IsMongoId()
  @IsOptional()
  readonly parentCategoryId?: Types.ObjectId;

  @IsBoolean()
  @IsOptional()
  readonly isHidden?: boolean;
}
