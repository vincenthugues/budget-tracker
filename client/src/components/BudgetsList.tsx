import { useState } from 'react';
import { createBudget } from '../api';
import { useBudgets } from '../hooks/useBudgets';
import { useResourcesHandler } from '../hooks/useResourcesHandler';
import { Budget, BudgetDraft } from '../types/Budget';
import { CreatorInput } from '../types/Creator';
import Creator from './Creator';
import DeleteButton from './DeleteButton';

const BudgetCreator = ({
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

const BudgetsList = (): JSX.Element => {
  const { budgets: fetchedBudgets, isLoading, error } = useBudgets();
  const [budgets, addBudget, removeBudgetById] = useResourcesHandler(
    fetchedBudgets || []
  );

  const onDelete = async (budgetId: string) => {
    await fetch(`/budgets/${budgetId}`, {
      method: 'DELETE',
    });
    removeBudgetById(budgetId);
  };

  if (error) {
    console.log(`Error: ${error}`);
    return <div>Error when fetching data</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BudgetCreator onAddBudget={addBudget} />
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
              <td>
                {startingDate && new Date(startingDate).toLocaleDateString()}
              </td>
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
    </>
  );
};

export default BudgetsList;
