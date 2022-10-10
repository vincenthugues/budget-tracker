import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Document } from 'mongoose';

export type PayeeDocument = Payee & Document;

@Schema({ timestamps: true })
export class Payee {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop()
  @IsOptional()
  externalId?: string;
}

export const PayeeSchema = SchemaFactory.createForClass(Payee);
