import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonthsService } from './months.service';
import { CreateMonthDto } from './dto/create-month.dto';
import { UpdateMonthDto } from './dto/update-month.dto';

@Controller('months')
export class MonthsController {
  constructor(private readonly monthsService: MonthsService) {}

  @Post()
  create(@Body() createMonthDto: CreateMonthDto) {
    return this.monthsService.create(createMonthDto);
  }

  @Get()
  findAll() {
    return this.monthsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monthsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonthDto: UpdateMonthDto) {
    return this.monthsService.update(+id, updateMonthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monthsService.remove(+id);
  }
}
