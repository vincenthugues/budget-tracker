import { useEffect, useState } from 'react';
import Creator from './Creator';

type Budget = {
  _id: string;
  name: string;
};

const Budgets = (): JSX.Element => {
  const [items, setItems] = useState<Budget[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [showCreator, setShowCreator] = useState(false);

  const onSubmit = async (budgetToCreate: { name: string }) => {
    const response = await fetch('/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetToCreate),
    });
    const createdBudget = await response.json();
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
  const budgetCreatorProperties = [
    { name: 'name', label: 'Name', type: 'text' },
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
        <ul>
          {items.map(({ _id, name }) => (
            <li key={_id}>
              {name}
              <button
                onClick={() => {
                  if (window.confirm(`Delete the account "${name}"?`)) {
                    onDelete(_id);
                  }
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </>
    );
  }
};

export default Budgets;
