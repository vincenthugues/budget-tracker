import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsOptional } from 'class-validator';
import { Document } from 'mongoose';

export type BudgetDocument = Budget & Document;

@Schema({ timestamps: true })
export class Budget {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  externalId: string;

  @Prop({ type: Date })
  @IsOptional()
  @IsDateString()
  startingDate?: Date;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
