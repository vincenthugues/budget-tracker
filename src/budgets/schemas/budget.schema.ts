import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BudgetDocument = Budget & Document;

@Schema()
export class Budget {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  externalId: string;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
