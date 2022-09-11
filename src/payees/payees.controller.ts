import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PayeesService } from './payees.service';
import { CreatePayeeDto } from './dto/create-payee.dto';
import { UpdatePayeeDto } from './dto/update-payee.dto';

@Controller('payees')
export class PayeesController {
  constructor(private readonly payeesService: PayeesService) {}

  @Post()
  create(@Body() createPayeeDto: CreatePayeeDto) {
    return this.payeesService.create(createPayeeDto);
  }

  @Get()
  findAll() {
    return this.payeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payeesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayeeDto: UpdatePayeeDto) {
    return this.payeesService.update(id, updatePayeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payeesService.remove(id);
  }
}
