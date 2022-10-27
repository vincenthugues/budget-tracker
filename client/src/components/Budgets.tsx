import { useEffect, useState } from 'react';

type Budget = {
  _id: string;
  name: string;
};

type BudgetCreatorProps = {
  onSubmit: Function;
  onCancel: Function;
};
const BudgetCreator = ({
  onSubmit,
  onCancel,
}: BudgetCreatorProps): JSX.Element => {
  const [name, setName] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name });
      }}
    >
      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
      <button type="button" onClick={() => onCancel()}>
        Cancel
      </button>
    </form>
  );
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
          <BudgetCreator onSubmit={onSubmit} onCancel={onCancel} />
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
