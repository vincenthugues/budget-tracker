import { useEffect, useState } from 'react';
import Creator from './Creator';

type Account = {
  _id: string;
  name: string;
};

const Accounts = (): JSX.Element => {
  const [items, setItems] = useState<Account[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [showCreator, setShowCreator] = useState(false);

  const onSubmit = async (accountToCreate: { name: string }) => {
    const response = await fetch('/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountToCreate),
    });
    const createdAccount = await response.json();
    setItems([...items, createdAccount]);

    setShowCreator(false);
  };
  const onCancel = () => {
    setShowCreator(false);
  };
  const onDelete = async (accountId: string) => {
    await fetch(`/accounts/${accountId}`, {
      method: 'DELETE',
    });
    setItems(items.filter(({ _id }) => _id !== accountId));
  };
  const accountCreatorProperties = [
    { name: 'name', label: 'Name', type: 'text' },
  ];

  useEffect(() => {
    fetch('/accounts')
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
    console.error(`Error: ${error.message}`);
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
            properties={accountCreatorProperties}
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

export default Accounts;
