import { useState } from 'react';
import { useFetchedResource, useResourcesHandler } from '../hooks';
import { Account, AccountDraft, AccountType } from '../types/Account';
import { CreatorInput } from '../types/Creator';
import { getDisplayFormattedAmount } from '../utils';
import Creator from './Creator';

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
  const [fetchedAccounts, isLoading, errorMessage] =
    useFetchedResource<Account>('accounts');
  const [accounts, addAccount, removeAccountById] =
    useResourcesHandler(fetchedAccounts);

  const onDelete = async (accountId: string) => {
    await fetch(`/accounts/${accountId}`, {
      method: 'DELETE',
    });
    removeAccountById(accountId);
  };

  if (errorMessage) {
    console.error(`Error: ${errorMessage}`);
    return <div>Error when fetching data</div>;
  } else if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <AccountCreator onAddAccount={addAccount} />
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
            {accounts.map(
              ({ _id, name, externalId, type, isClosed, balance }) => (
                <tr key={_id}>
                  <td>{_id}</td>
                  <td>{name}</td>
                  <td>{type}</td>
                  <td>
                    {balance !== undefined &&
                      getDisplayFormattedAmount(balance)}
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
              )
            )}
          </tbody>
        </table>
      </>
    );
  }
};

export default AccountsList;
