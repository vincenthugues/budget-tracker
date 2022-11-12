import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from 'src/categories/categories.service';
import { AccountsService } from '../accounts/accounts.service';
import { AccountType } from '../accounts/schemas/account.schema';
import { BudgetsService } from '../budgets/budgets.service';
import { ImportDto } from './dto/import.dto';

@ApiTags('import')
@Controller('import')
export class ImportController {
  constructor(
    private readonly budgetsService: BudgetsService,
    private readonly accountsService: AccountsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: [Object],
    description: 'Resources successfully created',
  })
  async create(@Body() inputs: ImportDto): Promise<any> {
    const { resourceName, json } = inputs;
    const parsedJSON = JSON.parse(json);
    let resourcesToCreate = parsedJSON?.data[resourceName] ?? parsedJSON;

    let createdResources;
    switch (resourceName) {
      case 'budgets':
        createdResources = resourcesToCreate.map(({ id, name, first_month }) =>
          this.budgetsService.create({
            name,
            startingDate: first_month,
            externalId: id,
          }),
        );
        break;
      case 'accounts':
        createdResources = resourcesToCreate.map(
          ({ id, name, type, closed, balance }) =>
            this.accountsService.create({
              name,
              externalId: id,
              type: AccountType[type.toUpperCase()],
              isClosed: closed,
              balance,
            }),
        );
        break;
      case 'category_groups':
        createdResources = resourcesToCreate.flatMap(async (categoryGroup) => {
          const parentCategory = await this.categoriesService.create({
            name: categoryGroup.name,
            isDeleted: categoryGroup.deleted,
            externalId: categoryGroup.id,
            isHidden: categoryGroup.hidden,
          });
          const subCategories = categoryGroup.categories.map(
            ({ id, name, hidden, deleted }) =>
              this.categoriesService.create({
                name,
                isDeleted: deleted,
                externalId: id,
                parentCategoryId: parentCategory._id,
                isHidden: hidden,
              }),
          );
          return [parentCategory, ...subCategories];
        });
        break;
      default:
        console.log(`import: Resource "${resourceName}" unhandled`);
        throw new BadRequestException(
          `import: Resource "${resourceName}" unhandled`,
        );
    }

    return Promise.all(createdResources);
  }
}
