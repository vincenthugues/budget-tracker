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
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
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
    description: 'Returns the list of accounts',
  })
  findAll(): Promise<AccountDocument[]> {
    return this.accountsService.findAll();
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
  remove(@Param('id') id: Types.ObjectId): Promise<AccountDocument> {
    return this.accountsService.remove(id);
  }
}
