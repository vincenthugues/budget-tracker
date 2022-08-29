import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly externalId: string;

  @IsMongoId()
  readonly parentCategory?: Types.ObjectId;

  @IsBoolean()
  readonly isHidden?: boolean;

  @IsBoolean()
  readonly isDeleted?: boolean;
}
