import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Category,
    description: 'Category successfully created',
  })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOkResponse({
    type: [Category],
    description: 'Returns the list of categories matching the optional filters',
  })
  findAll(@Query() filters?: FilterCategoryDto): Promise<CategoryDocument[]> {
    return this.categoriesService.findAll(filters);
  }

  @Get(':id')
  @ApiOkResponse({
    type: Category,
    description: 'Returns the requested category',
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  findOne(@Param('id') id: Types.ObjectId): Promise<CategoryDocument> {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: Category,
    description: 'Returns the updated category',
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'The requested category was deleted' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  remove(@Param('id') id: Types.ObjectId): Promise<any> {
    return this.categoriesService.remove(id);
  }
}
