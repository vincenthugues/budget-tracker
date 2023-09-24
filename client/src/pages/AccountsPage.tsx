import { AccountCreator } from '../components/AccountsList';
import DeleteButton from '../components/DeleteButton';
import { useAccounts } from '../hooks/useAccounts';
import { useResourcesHandler } from '../hooks/useResourcesHandler';
import { getDisplayFormattedAmount } from '../utils/getDisplayFormattedAmount';

export const AccountsPage = (): JSX.Element => {
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
