import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  findAll() {
    return this.categoryModel.find().exec();
  }

  findOne(id: number) {
    return this.categoryModel.findById(id).exec();
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.findOneAndUpdate({ id }, updateCategoryDto, {
      new: true,
    });
  }

  remove(id: number) {
    return this.categoryModel.deleteOne({ id });
  }
}
