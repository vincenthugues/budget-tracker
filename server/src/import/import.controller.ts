import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { BudgetsService } from 'src/budgets/budgets.service';
import { ImportDto } from './dto/import.dto';

@ApiTags('import')
@Controller('import')
export class ImportController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiCreatedResponse({
    type: [Object],
    description: 'Resources successfully created',
  })
  create(@Body() inputs: ImportDto): Promise<any> {
    const { resourceName, json } = inputs;
    const parsedJSON = JSON.parse(json);
    let resourcesToCreate = parsedJSON?.data[resourceName] ?? parsedJSON;

    if (resourceName !== 'budgets') {
      console.log(`import: Resource "${resourceName}" unhandled`);
      throw new BadRequestException(
        `import: Resource "${resourceName}" unhandled`,
      );
    }

    const createdResources = resourcesToCreate.map(
      ({ id, name, first_month }) =>
        this.budgetsService.create({
          name,
          startingDate: first_month,
          externalId: id,
        }),
    );

    return Promise.all(createdResources);
  }
}
