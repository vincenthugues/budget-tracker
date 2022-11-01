import { useEffect, useState } from 'react';
import Creator, { CreatorInput } from './Creator';

type Payee = {
  _id: string;
  name: string;
  externalId?: string;
};

const Payees = (): JSX.Element => {
  const [items, setItems] = useState<Payee[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [showCreator, setShowCreator] = useState(false);

  const onSubmit = async (payeeToCreate: { name: string }) => {
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

    setItems([...items, createdPayee]);
    setShowCreator(false);
  };
  const onCancel = () => {
    setShowCreator(false);
  };
  const onDelete = async (payeeId: string) => {
    await fetch(`/payees/${payeeId}`, {
      method: 'DELETE',
    });
    setItems(items.filter(({ _id }) => _id !== payeeId));
  };
  const payeeCreatorProperties: CreatorInput[] = [
    { name: 'name', label: 'Name', type: 'text' },
    {
      name: 'externalId',
      label: 'External ID',
      type: 'text',
      isOptional: true,
    },
  ];

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

export default Payees;
