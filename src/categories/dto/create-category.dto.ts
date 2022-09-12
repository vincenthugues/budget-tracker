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

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly externalId?: string;

  @IsMongoId()
  @IsOptional()
  readonly parentCategory?: Types.ObjectId;

  @IsBoolean()
  @IsOptional()
  readonly isHidden?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isDeleted?: boolean;
}
