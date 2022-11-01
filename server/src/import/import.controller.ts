import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AccountsService } from 'src/accounts/accounts.service';
import { AccountType } from 'src/accounts/schemas/account.schema';
import { BudgetsService } from 'src/budgets/budgets.service';
import { ImportDto } from './dto/import.dto';

@ApiTags('import')
@Controller('import')
export class ImportController {
  constructor(
    private readonly budgetsService: BudgetsService,
    private readonly accountsService: AccountsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: [Object],
    description: 'Resources successfully created',
  })
  create(@Body() inputs: ImportDto): Promise<any> {
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
      default:
        console.log(`import: Resource "${resourceName}" unhandled`);
        throw new BadRequestException(
          `import: Resource "${resourceName}" unhandled`,
        );
    }

    return Promise.all(createdResources);
  }
}
