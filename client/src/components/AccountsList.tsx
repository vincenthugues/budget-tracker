import { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useResourcesHandler } from '../hooks/useResourcesHandler';
import { Account, AccountDraft, AccountType } from '../types/Account';
import { CreatorInput } from '../types/Creator';
import { getDisplayFormattedAmount } from '../utils/getDisplayFormattedAmount';
import Creator from './Creator';
import DeleteButton from './DeleteButton';

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

  if (showCreator) {
    return (
      <Creator
        onSubmit={onSubmit}
        onCancel={onCancel}
        properties={accountCreatorProperties}
      />
    );
  }

  return (
    <button
      onClick={() => {
        setShowCreator(true);
      }}
    >
      ➕
    </button>
  );
};

const AccountsList = (): JSX.Element => {
  const { accounts: fetchedAccounts = [], isLoading, error } = useAccounts();
  const [accounts, addAccount, removeAccountById] =
    useResourcesHandler(fetchedAccounts);

  const onDelete = async (accountId: string) => {
    await fetch(`/accounts/${accountId}`, {
      method: 'DELETE',
    });
    removeAccountById(accountId);
  };

  if (error) {
    console.error(`Error: ${error}`);
    return <div>Error when fetching data</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AccountCreator onAddAccount={addAccount} />
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Balance</th>
            <th>Is closed</th>
            <th>External ID</th>
            <th>Actions</th>
          </tr>
          {accounts.map(
            ({ _id, name, externalId, type, isClosed, balance }) => (
              <tr key={_id}>
                <td>{name}</td>
                <td>{type}</td>
                <td>
                  {balance !== undefined && getDisplayFormattedAmount(balance)}
                </td>
                <td>{isClosed ? 'Yes' : 'No'}</td>
                <td className="ellipsisCell">{externalId}</td>
                <td>
                  <DeleteButton
                    confirmationMessage={`Delete the account "${name}"?`}
                    onDelete={() => onDelete(_id)}
                  />
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
};

export default AccountsList;
