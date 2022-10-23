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
import { CreatePayeeDto } from './dto/create-payee.dto';
import { UpdatePayeeDto } from './dto/update-payee.dto';
import { PayeesService } from './payees.service';
import { Payee, PayeeDocument } from './schemas/payee.schema';

@ApiTags('payees')
@Controller('payees')
export class PayeesController {
  constructor(private readonly payeesService: PayeesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Payee,
    description: 'Payee successfully created',
  })
  create(@Body() createPayeeDto: CreatePayeeDto): Promise<PayeeDocument> {
    return this.payeesService.create(createPayeeDto);
  }

  @Get()
  @ApiOkResponse({
    type: [Payee],
    description: 'Returns the list of payees',
  })
  findAll(): Promise<PayeeDocument[]> {
    return this.payeesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: Payee,
    description: 'Returns the requested payee',
  })
  @ApiNotFoundResponse({ description: 'Payee not found' })
  findOne(@Param('id') id: Types.ObjectId): Promise<PayeeDocument> {
    return this.payeesService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: Payee,
    description: 'Returns the updated payee',
  })
  @ApiNotFoundResponse({ description: 'Payee not found' })
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updatePayeeDto: UpdatePayeeDto,
  ): Promise<PayeeDocument> {
    return this.payeesService.update(id, updatePayeeDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'The requested payee was deleted' })
  @ApiNotFoundResponse({ description: 'Payee not found' })
  remove(@Param('id') id: Types.ObjectId): Promise<any> {
    return this.payeesService.remove(id);
  }
}
