import { useEffect, useState } from 'react';
import Creator from './Creator';

type Payee = {
  _id: string;
  name: string;
};

const Payees = (): JSX.Element => {
  const [items, setItems] = useState<Payee[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [showCreator, setShowCreator] = useState(false);

  const onSubmit = async (payeeToCreate: { name: string }) => {
    const response = await fetch('/payees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payeeToCreate),
    });
    const createdPayee = await response.json();
    setItems([...items, createdPayee]);

    setShowCreator(false);
  };
  const onCancel = () => {
    setShowCreator(false);
  };
  const onDelete = async (payeeId: string) => {
    await fetch(`/payees/${payeeId}`, {
      method: 'DELETE',
    });
    setItems(items.filter(({ _id }) => _id !== payeeId));
  };
  const payeeCreatorProperties = [
    { name: 'name', label: 'Name', type: 'text' },
  ];

  useEffect(() => {
    fetch('/payees')
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
            properties={payeeCreatorProperties}
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
              {name}{' '}
              <button
                onClick={() => {
                  if (window.confirm(`Delete the payee "${name}"?`)) {
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

export default Payees;
