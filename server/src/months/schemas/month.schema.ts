import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { SchemaTypes, Types } from 'mongoose';
import { Category } from 'src/categories/schemas/category.schema';

enum GoalType {
  BalanceByDate, // One-time bills & expenses, vacation fund, medium- and long-term projects/expenses...
  MonthlyBudget, // Rent, utilities, food or hobby budget, expense category to limit...
  MinimumBalance, // Emergency fund, unexpected expense fund...
}

class Goal {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: Category.name,
  })
  categoryId: Types.ObjectId;

  @Prop({ type: String, enum: GoalType })
  @IsEnum(GoalType)
  goalType: GoalType;

  @Prop()
  target: number;

  @Prop()
  budgeted: number;

  @Prop()
  activity: number;

  @Prop()
  balance: number;

  @Prop({ required: true, default: false })
  isHidden: boolean;

  @Prop({ required: true, default: false })
  isDeleted: boolean;

  @Prop()
  @IsOptional()
  @IsDateString()
  startMonth: Date;

  @Prop()
  @IsOptional()
  @IsDateString()
  endMonth: Date;
}

@Schema({ timestamps: true })
export class Month {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  @IsDateString()
  monthDate: Date;

  @Prop({ required: true, default: false })
  isDeleted: boolean;

  @Prop({ default: 0 })
  income: number;

  @Prop()
  goals: Goal[];

  @Prop({ default: 0 })
  @IsOptional()
  budgeted?: number;

  @Prop({ default: 0 })
  @IsOptional()
  toBeBudgeted?: number;

  @Prop({ default: 0 })
  @IsOptional()
  activity?: number;

  @Prop()
  @IsOptional()
  externalId?: string;
}

export const MonthSchema = SchemaFactory.createForClass(Month);
