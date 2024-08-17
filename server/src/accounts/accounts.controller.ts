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
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { FilterAccountDto } from './dto/filter-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from './schemas/account.schema';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Account,
    description: 'Account successfully created',
  })
  create(@Body() createAccountDto: CreateAccountDto): Promise<AccountDocument> {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @ApiOkResponse({
    type: [Account],
    description: 'Returns the list of accounts matching the optional filters',
  })
  async findAll(
    @Query() filters?: FilterAccountDto,
  ): Promise<AccountDocument[]> {
    const fixLegacyAccountBalance = (
      account: AccountDocument,
    ): AccountDocument => {
      const isLegacyAccount = !!account.externalId;
      if (isLegacyAccount && account.balance) {
        account.balance /= 10;
      }
      return account;
    };
    const accounts = await this.accountsService.findAll(filters);

    return accounts.map(fixLegacyAccountBalance);
  }

  @Get(':id')
  @ApiOkResponse({
    type: Account,
    description: 'Returns the requested account',
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  findOne(@Param('id') id: Types.ObjectId): Promise<AccountDocument> {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: Account,
    description: 'Returns the updated account',
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<AccountDocument> {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'The requested account was deleted' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  remove(@Param('id') id: Types.ObjectId): Promise<any> {
    return this.accountsService.remove(id);
  }
}
