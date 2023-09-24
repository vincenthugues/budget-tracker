import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Account } from '../../accounts/schemas/account.schema';
import { Category } from '../../categories/schemas/category.schema';
import { Payee } from '../../payees/schemas/payee.schema';

export enum TransferType {
  DEBIT = 'Debit',
  CREDIT = 'Credit',
}

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, default: Date.now() })
  @IsDateString()
  date: Date;

  @Prop({ required: true })
  @IsNumber()
  amount: number;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: Account.name,
  })
  accountId: Types.ObjectId;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: Payee.name,
  })
  payeeId: Types.ObjectId;

  @Prop({ required: true, default: false })
  @IsBoolean()
  isCleared: boolean;

  @Prop({ required: true, default: false })
  @IsBoolean()
  isDeleted: boolean;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Category.name,
  })
  @IsOptional()
  categoryId?: Types.ObjectId;

  @Prop()
  @IsOptional()
  externalId?: string;

  @Prop()
  @IsOptional()
  notes?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
