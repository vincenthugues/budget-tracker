import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PayeeDocument = Payee & Document;

@Schema({ timestamps: true })
export class Payee {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  externalId?: string;
}

export const PayeeSchema = SchemaFactory.createForClass(Payee);
