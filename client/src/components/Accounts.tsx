import { useEffect, useState } from 'react';
import Creator, { CreatorInput } from './Creator';

enum AccountType {
  CHECKING = 'Checking',
  SAVINGS = 'Savings',
  OTHER = 'Other',
}

type Account = {
  _id: string;
  name: string;
  externalId?: string;
  type?: AccountType;
  isClosed?: boolean;
  balance?: number;
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

    if (createdAccount.error) {
      console.error(
        `Error (${createdAccount.statusCode}: ${createdAccount.error}) while creating the resource: `,
        createdAccount.message.join(', ')
      );
      return;
    }

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
  const accountCreatorProperties: CreatorInput[] = [
    { name: 'name', label: 'Name', type: 'text' },
    {
      name: 'externalId',
      label: 'External Id',
      type: 'text',
      isOptional: true,
    },
    {
      name: 'type',
      label: 'Type',
      type: 'text',
      isOptional: true,
      options: Object.entries(AccountType),
    },
    {
      name: 'isClosed',
      label: 'Is closed',
      type: 'checkbox',
      isOptional: true,
    },
    { name: 'balance', label: 'Balance', type: 'number', isOptional: true },
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
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Is closed</th>
              <th>External ID</th>
              <th></th>
            </tr>
            {items.map(({ _id, name, externalId, type, isClosed, balance }) => (
              <tr key={_id}>
                <td>{_id}</td>
                <td>{name}</td>
                <td>{type}</td>
                <td>{balance}</td>
                <td>{isClosed ? 'Yes' : 'No'}</td>
                <td>{externalId}</td>
                <td>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete the account "${name}"?`)) {
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

export default Accounts;
