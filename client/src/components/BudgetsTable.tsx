import { useState } from 'react';
import { createBudget } from '../api';
import { Budget, BudgetDraft } from '../types/Budget';
import { CreatorInput } from '../types/Creator';
import Creator from './Creator';
import DeleteButton from './DeleteButton';

export const BudgetCreator = ({
  onAddBudget,
}: {
  onAddBudget: (budget: Budget) => void;
}) => {
  const [showCreator, setShowCreator] = useState(false);

  const budgetCreatorProperties: CreatorInput[] = [
    { name: 'name', label: 'Name', type: 'text' },
    {
      name: 'externalId',
      label: 'External ID',
      type: 'text',
      isOptional: true,
    },
    {
      name: 'startingDate',
      label: 'Starting date',
      type: 'date',
      defaultValue: null,
      isOptional: true,
    },
  ];

  const onSubmit = async (budgetToCreate: BudgetDraft) => {
    const createdBudget = await createBudget(budgetToCreate);

    if (createdBudget.message) {
      console.error(
        `Error ${createdBudget.statusCode} while creating the resource: ${createdBudget.message}`
      );
      return;
    }

    onAddBudget(createdBudget);
    setShowCreator(false);
  };

  const onCancel = () => {
    setShowCreator(false);
  };

  if (showCreator) {
    return (
      <Creator
        onSubmit={onSubmit}
        onCancel={onCancel}
        properties={budgetCreatorProperties}
      />
    );
  }

  return (
    <button
      onClick={() => {
        setShowCreator(true);
      }}
    >
      ➕
    </button>
  );
};

export const BudgetsTable = ({
  budgets,
  onDelete,
}: {
  budgets: Budget[];
  onDelete: (budgetId: Budget['_id']) => void;
}): JSX.Element => (
  <table>
    <tbody>
      <tr>
        <th>Name</th>
        <th>Starting date</th>
        <th>External ID</th>
        <th>Actions</th>
      </tr>
      {budgets.map(({ _id, name, externalId, startingDate }) => (
        <tr key={_id}>
          <td>{name}</td>
          <td>{startingDate && new Date(startingDate).toLocaleDateString()}</td>
          <td className="ellipsisCell">{externalId}</td>
          <td>
            <DeleteButton
              confirmationMessage={`Delete the budget "${name}"?`}
              onDelete={() => onDelete(_id)}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
