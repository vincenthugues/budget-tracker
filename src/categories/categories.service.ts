import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  findOne(id: Types.ObjectId): Promise<Category> {
    return this.categoryModel.findById(id).exec();
  }

  update(id: Types.ObjectId, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.findOneAndUpdate({ id }, updateCategoryDto, {
      new: true,
    });
  }

  remove(id: Types.ObjectId) {
    return this.categoryModel.deleteOne({ id });
  }
}
