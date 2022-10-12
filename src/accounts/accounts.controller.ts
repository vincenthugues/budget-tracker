import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from './schemas/account.schema';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiBody({ type: CreateAccountDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Account,
  })
  create(@Body() createAccountDto: CreateAccountDto): Promise<AccountDocument> {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  findAll(): Promise<AccountDocument[]> {
    return this.accountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AccountDocument> {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }
}
