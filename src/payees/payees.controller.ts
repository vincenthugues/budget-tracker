import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  create(@Body() createPayeeDto: CreatePayeeDto): Promise<PayeeDocument> {
    return this.payeesService.create(createPayeeDto);
  }

  @Get()
  findAll(): Promise<PayeeDocument[]> {
    return this.payeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId): Promise<PayeeDocument> {
    return this.payeesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updatePayeeDto: UpdatePayeeDto,
  ) {
    return this.payeesService.update(id, updatePayeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.payeesService.remove(id);
  }
}
