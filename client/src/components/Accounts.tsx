import { useEffect, useState } from 'react';

type Account = {
  _id: string;
  name: string;
};

type AccountCreatorProps = {
  onSubmit: Function;
  onCancel: Function;
};
const AccountCreator = ({
  onSubmit,
  onCancel,
}: AccountCreatorProps): JSX.Element => {
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
          <AccountCreator onSubmit={onSubmit} onCancel={onCancel} />
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
            <li key={_id}>{name}</li>
          ))}
        </ul>
      </>
    );
  }
};

export default Accounts;
