import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

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

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Account',
  })
  accountId: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Payee',
  })
  payeeId: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Category',
  })
  categoryId: string;

  @Prop({ required: true, default: false })
  @IsBoolean()
  isCleared: boolean;

  @Prop({ required: true, default: false })
  @IsBoolean()
  isDeleted: boolean;

  @Prop()
  @IsOptional()
  externalId?: string;

  @Prop()
  @IsOptional()
  notes?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

export type TransactionDocument = Transaction & Document;
