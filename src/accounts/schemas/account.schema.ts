import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsOptional } from 'class-validator';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

export enum AccountType {
  CHECKING = 'Checking',
  SAVINGS = 'Savings',
  OTHER = 'Other',
}

@Schema({ timestamps: true })
export class Account {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop()
  @IsOptional()
  externalId?: string;

  @Prop({ type: String, enum: AccountType })
  @IsEnum(AccountType)
  @IsOptional()
  type?: AccountType;

  @Prop({ default: false })
  @IsOptional()
  isClosed?: boolean;

  @Prop({ default: 0 })
  @IsOptional()
  balance?: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
