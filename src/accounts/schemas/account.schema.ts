import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

export enum AccountType {
  CHECKING,
  SAVINGS,
  OTHER,
}

@Schema({ timestamps: true })
export class Account {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  externalId: string;

  // @Prop({ type: AccountType, enum: AccountType })
  @Prop()
  @IsEnum(AccountType)
  @IsOptional()
  type: string;

  @Prop({ default: false })
  @IsOptional()
  isClosed: boolean;

  @Prop({ default: 0 })
  @IsOptional()
  balance: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
