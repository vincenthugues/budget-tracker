import { useEffect, useState } from 'react';
import Creator, { CreatorInput } from './Creator';

type PayeeDraft = {
  _id: string;
  name: string;
  externalId?: string;
};

type Payee = PayeeDraft & { _id: string };

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
  const [items, setItems] = useState<Payee[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const addItem = (newItem: Payee) => {
    setItems([...items, newItem]);
  };

  const onDelete = async (payeeId: string) => {
    await fetch(`/payees/${payeeId}`, {
      method: 'DELETE',
    });
    setItems(items.filter(({ _id }) => _id !== payeeId));
  };

  useEffect(() => {
    fetch('/payees')
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
    console.log(`Error: ${error.message}`);
    return <div>Error when fetching data</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <PayeeCreator onAddPayee={addItem} />
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>External ID</th>
              <th></th>
            </tr>
            {items.map(({ _id, name, externalId }) => (
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
