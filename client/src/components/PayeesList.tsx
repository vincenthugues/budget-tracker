import { useState } from 'react';
import { useFetchedResource, useResourcesHandler } from '../hooks';
import { CreatorInput } from '../types/Creator';
import { Payee, PayeeDraft } from '../types/Payee';
import Creator from './Creator';

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
    </>
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
              <th>ID</th>
              <th>Name</th>
              <th>External ID</th>
              <th></th>
            </tr>
            {payees.map(({ _id, name, externalId }) => (
              <tr key={_id}>
                <td>{_id}</td>
                <td>{name}</td>
                <td>{externalId}</td>
                <td>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete the payee "${name}"?`)) {
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

export default PayeesList;
