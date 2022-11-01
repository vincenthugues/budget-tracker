import { useEffect, useState } from 'react';
import Creator, { CreatorInput } from './Creator';

type BudgetDraft = {
  name: string;
  externalId?: string;
  startingDate?: Date;
};

type Budget = BudgetDraft & { _id: string };

const Budgets = (): JSX.Element => {
  const [items, setItems] = useState<Budget[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [showCreator, setShowCreator] = useState(false);

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

    setItems([...items, createdBudget]);
    setShowCreator(false);
  };
  const onCancel = () => {
    setShowCreator(false);
  };
  const onDelete = async (budgetId: string) => {
    await fetch(`/budgets/${budgetId}`, {
      method: 'DELETE',
    });
    setItems(items.filter(({ _id }) => _id !== budgetId));
  };
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

  useEffect(() => {
    fetch('/budgets')
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    console.log(`Error: ${error.message}`);
    return <div>Error when fetching data</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
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
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Starting date</th>
              <th>External ID</th>
              <th></th>
            </tr>
            {items.map(({ _id, name, externalId, startingDate }) => (
              <tr key={_id}>
                <td>{_id}</td>
                <td>{name}</td>
                <td>
                  {startingDate && new Date(startingDate).toLocaleDateString()}
                </td>
                <td>{externalId}</td>
                <td>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete the budget "${name}"?`)) {
                        onDelete(_id);
                      }
                    }}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
};

export default Budgets;
