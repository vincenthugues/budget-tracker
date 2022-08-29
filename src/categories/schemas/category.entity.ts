import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  externalId: string;

  @Prop()
  @IsOptional()
  parentCategory: Types.ObjectId;

  @Prop({ default: false })
  @IsOptional()
  isHidden: boolean;

  @Prop({ default: false })
  @IsOptional()
  isDeleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
