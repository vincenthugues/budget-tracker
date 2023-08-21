import { Injectable } from '@nestjs/common';
import { CreateMonthDto } from './dto/create-month.dto';
import { UpdateMonthDto } from './dto/update-month.dto';

@Injectable()
export class MonthsService {
  create(createMonthDto: CreateMonthDto) {
    return 'This action adds a new month';
  }

  findAll() {
    return `This action returns all months`;
  }

  findOne(id: number) {
    return `This action returns a #${id} month`;
  }

  update(id: number, updateMonthDto: UpdateMonthDto) {
    return `This action updates a #${id} month`;
  }

  remove(id: number) {
    return `This action removes a #${id} month`;
  }
}
