import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  @IsDateString()
  date: Date;

  @Prop({ required: true })
  @IsNumber()
  amount: number;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  account: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  payee: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  category: Types.ObjectId;

  @Prop({ required: true, default: false })
  @IsBoolean()
  isCleared: Boolean;

  @Prop({ required: true, default: false })
  @IsBoolean()
  isDeleted: Boolean;

  @Prop()
  @IsOptional()
  externalId?: string;

  @Prop()
  @IsOptional()
  notes?: String;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

export type TransactionDocument = Transaction & Document;
