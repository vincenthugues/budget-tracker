import { useEffect, useState } from 'react';
import { getDisplayFormattedAmount } from '../utils';
import Creator, { CreatorInput } from './Creator';

enum AccountType {
  CHECKING = 'Checking',
  SAVINGS = 'Savings',
  OTHER = 'Other',
}

type AccountDraft = {
  _id: string;
  name: string;
  externalId?: string;
  type?: AccountType;
  isClosed?: boolean;
  balance?: number;
};

type Account = AccountDraft & { _id: string };

const AccountCreator = ({
  onAddAccount,
}: {
  onAddAccount: (account: Account) => void;
}) => {
  const [showCreator, setShowCreator] = useState(false);

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

  const onSubmit = async (accountToCreate: AccountDraft) => {
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

    onAddAccount(createdAccount);
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
    </>
  );
};

const AccountsList = (): JSX.Element => {
  const [items, setItems] = useState<Account[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const addItem = (newItem: Account) => {
    setItems([...items, newItem]);
  };

  const onDelete = async (accountId: string) => {
    await fetch(`/accounts/${accountId}`, {
      method: 'DELETE',
    });
    setItems(items.filter(({ _id }) => _id !== accountId));
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
        <AccountCreator onAddAccount={addItem} />
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
                <td>
                  {balance !== undefined
                    ? getDisplayFormattedAmount(balance)
                    : ''}
                </td>
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

export default AccountsList;
