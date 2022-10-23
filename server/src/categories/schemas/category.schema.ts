import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Document, SchemaTypes, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: false })
  isHidden: boolean;

  @Prop({ required: true, default: false })
  isDeleted: boolean;

  @Prop()
  @IsOptional()
  externalId?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Category.name })
  @IsOptional()
  parentCategoryId?: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
