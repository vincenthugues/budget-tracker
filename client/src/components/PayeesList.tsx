import { useState } from 'react';
import { useFetchedResource } from '../hooks/useFetchedResource';
import { useResourcesHandler } from '../hooks/useResourcesHandler';
import { CreatorInput } from '../types/Creator';
import { Payee, PayeeDraft } from '../types/Payee';
import Creator from './Creator';
import DeleteButton from './DeleteButton';

const PayeeCreator = ({
  onAddPayee,
}: {
  onAddPayee: (payee: Payee) => void;
}) => {
  const [showCreator, setShowCreator] = useState(false);

  const payeeCreatorProperties: CreatorInput[] = [
    { name: 'name', label: 'Name', type: 'text' },
    {
      name: 'externalId',
      label: 'External ID',
      type: 'text',
      isOptional: true,
    },
  ];

  const onSubmit = async (payeeToCreate: PayeeDraft) => {
    const response = await fetch('/payees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payeeToCreate),
    });
    const createdPayee = await response.json();

    if (createdPayee.error) {
      console.error(
        `Error (${createdPayee.statusCode}: ${createdPayee.error}) while creating the resource: `,
        createdPayee.message.join(', ')
      );
      return;
    }

    onAddPayee(createdPayee);
    setShowCreator(false);
  };

  const onCancel = () => {
    setShowCreator(false);
  };

  if (showCreator) {
    <Creator
      onSubmit={onSubmit}
      onCancel={onCancel}
      properties={payeeCreatorProperties}
    />;
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

const PayeesList = (): JSX.Element => {
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

export default PayeesList;
