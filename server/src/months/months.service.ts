import { Injectable } from '@nestjs/common';
import { CreateMonthDto } from './dto/create-month.dto';
import { UpdateMonthDto } from './dto/update-month.dto';
import { Types } from 'mongoose';

@Injectable()
export class MonthsService {
  create(createMonthDto: CreateMonthDto) {
    console.log({ createMonthDto });
    return 'This action adds a new month';
  }

  findAll() {
    return `This action returns all months`;
  }

  findOne(id: Types.ObjectId) {
    return `This action returns a #${id} month`;
  }

  update(id: Types.ObjectId, updateMonthDto: UpdateMonthDto) {
    console.log({ updateMonthDto });
    return `This action updates a #${id} month`;
  }

  remove(id: Types.ObjectId) {
    return `This action removes a #${id} month`;
  }
}
