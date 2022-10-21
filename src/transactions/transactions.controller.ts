import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Transaction,
    description: 'Transaction successfully created',
  })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDocument> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @ApiOkResponse({
    type: [Transaction],
    description: 'Returns the list of transactions',
  })
  findAll(): Promise<TransactionDocument[]> {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: Transaction,
    description: 'Returns the requested transaction',
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  findOne(@Param('id') id: Types.ObjectId): Promise<TransactionDocument> {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: Transaction,
    description: 'Returns the updated transaction',
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDocument> {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'The requested transaction was deleted' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  remove(@Param('id') id: Types.ObjectId): Promise<any> {
    return this.transactionsService.remove(id);
  }
}
