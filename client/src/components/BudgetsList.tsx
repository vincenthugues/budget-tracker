import { useState } from 'react';
import { useFetchedResource, useResourcesHandler } from '../hooks';
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
    const response = await fetch('/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetToCreate),
    });
    const createdBudget = await response.json();

    if (createdBudget.error) {
      console.error(
        `Error (${createdBudget.statusCode}: ${createdBudget.error}) while creating the resource: `,
        createdBudget.message.join(', ')
      );
      return;
    }

    onAddBudget(createdBudget);
    setShowCreator(false);
  };

  const onCancel = () => {
    setShowCreator(false);
  };

  return (
    <>
      {showCreator ? (
        <Creator
          onSubmit={onSubmit}
          onCancel={onCancel}
          properties={budgetCreatorProperties}
        />
      ) : (
        <button
          onClick={() => {
            setShowCreator(true);
          }}
        >
          ➕
        </button>
      )}
    </>
  );
};

const BudgetsList = (): JSX.Element => {
  const [fetchedBudgets, isLoading, errorMessage] =
    useFetchedResource<Budget>('budgets');
  const [budgets, addBudget, removeBudgetById] =
    useResourcesHandler(fetchedBudgets);

  const onDelete = async (budgetId: string) => {
    await fetch(`/budgets/${budgetId}`, {
      method: 'DELETE',
    });
    removeBudgetById(budgetId);
  };

  if (errorMessage) {
    console.log(`Error: ${errorMessage}`);
    return <div>Error when fetching data</div>;
  } else if (isLoading) {
    return <div>Loading...</div>;
  } else {
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
                <td>{externalId}</td>
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
  }
};

export default BudgetsList;
