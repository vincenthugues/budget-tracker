import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Document } from 'mongoose';
import { AccountsService } from '../accounts/accounts.service';
import {
  AccountDocument,
  AccountType,
} from '../accounts/schemas/account.schema';
import { BudgetsService } from '../budgets/budgets.service';
import { BudgetDocument } from '../budgets/schemas/budget.schema';
import { CategoriesService } from '../categories/categories.service';
import { CategoryDocument } from '../categories/schemas/category.schema';
import { PayeesService } from '../payees/payees.service';
import { PayeeDocument } from '../payees/schemas/payee.schema';
import {
  Transaction,
  TransactionDocument,
} from '../transactions/schemas/transaction.schema';
import { TransactionsService } from '../transactions/transactions.service';
import { ImportDto } from './dto/import.dto';

@ApiTags('import')
@Controller('import')
export class ImportController {
  constructor(
    private readonly budgetsService: BudgetsService,
    private readonly accountsService: AccountsService,
    private readonly categoriesService: CategoriesService,
    private readonly payeesService: PayeesService,
    private readonly transactionsService: TransactionsService,
  ) {}

  createBudget({ id, name, first_month }): Promise<BudgetDocument> {
    return this.budgetsService.create({
      name,
      startingDate: first_month,
      externalId: id,
    });
  }

  createAccount({ id, name, type, closed, balance }): Promise<AccountDocument> {
    return this.accountsService.create({
      name,
      externalId: id,
      type: AccountType[type.toUpperCase()],
      isClosed: closed,
      balance,
    });
  }

  async createCategories(categoryGroup): Promise<CategoryDocument[]> {
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
  }

  createPayee({ id, name }): Promise<PayeeDocument> {
    return this.payeesService.create({
      name,
      externalId: id,
    });
  }

  async createTransaction({
    id,
    date,
    amount,
    account_id,
    payee_id,
    category_id,
    memo,
    approved,
    deleted,
  }): Promise<TransactionDocument> {
    const [matchedAccounts, matchedPayees, matchedCategories] =
      await Promise.all([
        this.accountsService.findAll({
          externalId: account_id,
        }),
        await this.payeesService.findAll({
          externalId: payee_id,
        }),
        await this.categoriesService.findAll({
          externalId: category_id,
        }),
      ]);

    return this.transactionsService.create({
      date,
      amount,
      accountId: matchedAccounts[0]?._id,
      payeeId: matchedPayees[0]?._id,
      categoryId: matchedCategories[0]?._id,
      isCleared: !!approved,
      isDeleted: !!deleted,
      externalId: id,
      notes: memo || undefined,
    });
  }

  @Post()
  @ApiCreatedResponse({
    type: [Document],
    description: 'Resources successfully created',
  })
  @ApiBadRequestResponse({
    description: 'Resource unhandled',
  })
  async create(
    @Body() { resourceName, json }: ImportDto,
  ): Promise<(BudgetDocument | AccountDocument | CategoryDocument)[]> {
    const parsedJSON = JSON.parse(json);
    let parsedJSONEntities =
      (parsedJSON?.data && parsedJSON?.data[resourceName]) ?? parsedJSON;

    const HandlerByResourceName: {
      [name: string]: ({}) => Promise<
        | BudgetDocument
        | AccountDocument
        | CategoryDocument[]
        | PayeeDocument
        | TransactionDocument
      >;
    } = {
      budgets: this.createBudget,
      accounts: this.createAccount,
      category_groups: this.createCategories,
      payees: this.createPayee,
      transactions: this.createTransaction,
    };
    let handler = HandlerByResourceName[resourceName];

    if (!handler) {
      console.log(`import: Resource "${resourceName}" unhandled`);
      throw new BadRequestException(
        `import: Resource "${resourceName}" unhandled`,
      );
    }

    return Promise.all(parsedJSONEntities.map(handler.bind(this)));
  }
}
