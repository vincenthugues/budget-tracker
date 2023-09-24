import DeleteButton from '../components/DeleteButton';
import { PayeeCreator } from '../components/PayeesList';
import { useFetchedResource } from '../hooks/useFetchedResource';
import { useResourcesHandler } from '../hooks/useResourcesHandler';
import { Payee } from '../types/Payee';

export const PayeesPage = (): JSX.Element => {
  const [fetchedPayees, isLoading, errorMessage] =
    useFetchedResource<Payee>('payees');
  const [payees, addPayee, removePayeeById] =
    useResourcesHandler(fetchedPayees);

  const onDelete = async (payeeId: string) => {
    await fetch(`/payees/${payeeId}`, {
      method: 'DELETE',
    });

    removePayeeById(payeeId);
  };

  if (errorMessage) {
    console.log(`Error: ${errorMessage}`);
    return <div>Error when fetching data</div>;
  } else if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <PayeeCreator onAddPayee={addPayee} />
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>External ID</th>
              <th>Actions</th>
            </tr>
            {payees.map(({ _id, name, externalId }) => (
              <tr key={_id}>
                <td>{name}</td>
                <td className="ellipsisCell">{externalId}</td>
                <td>
                  <DeleteButton
                    confirmationMessage={`Delete the payee "${name}"?`}
                    onDelete={() => onDelete(_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
};
