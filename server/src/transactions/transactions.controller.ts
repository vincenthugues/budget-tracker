import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateTransactionUseCase } from '../use-cases/create-transaction.use-case';
import { DeleteTransactionUseCase } from '../use-cases/delete-transaction.use-case';
import { GetTransactionByIdUseCase } from '../use-cases/get-transaction-by-id.use-case';
import { UpdateTransactionUseCase } from '../use-cases/update-transaction.use-case';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: Transaction,
    description: 'Transaction successfully created',
  })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDocument> {
    return this.createTransactionUseCase.execute(createTransactionDto);
  }

  @Get()
  @ApiOkResponse({
    type: [Transaction],
    description:
      'Returns the list of transactions matching the optional filters',
  })
  async findAll(
    @Query() filters?: FilterTransactionDto,
  ): Promise<TransactionDocument[]> {
    const fixLegacyTransactionAmount = (
      transaction: TransactionDocument,
    ): TransactionDocument => {
      const isLegacyTransaction = !!transaction.externalId;
      if (isLegacyTransaction) {
        transaction.amount /= 10;
      }
      return transaction;
    };
    const transactions = await this.transactionsService.findAll(filters);

    return transactions.map(fixLegacyTransactionAmount);
  }

  @Get(':id')
  @ApiOkResponse({
    type: Transaction,
    description: 'Returns the requested transaction',
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  findOne(@Param('id') id: Types.ObjectId): Promise<TransactionDocument> {
    return this.getTransactionByIdUseCase.execute(id);
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
    return this.updateTransactionUseCase.execute(id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'The requested transaction was deleted' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  remove(@Param('id') id: string): Promise<any> {
    return this.deleteTransactionUseCase.execute(id);
  }
}
