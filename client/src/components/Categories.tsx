import { useEffect, useState } from 'react';
import Creator from './Creator';

type Category = {
  _id: string;
  name: string;
};

const Categories = (): JSX.Element => {
  const [items, setItems] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [showCreator, setShowCreator] = useState(false);

  const onSubmit = async (categoryToCreate: { name: string }) => {
    const response = await fetch('/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryToCreate),
    });
    const createdCategory = await response.json();
    setItems([...items, createdCategory]);

    setShowCreator(false);
  };
  const onCancel = () => {
    setShowCreator(false);
  };
  const onDelete = async (categoryId: string) => {
    await fetch(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
    setItems(items.filter(({ _id }) => _id !== categoryId));
  };
  const categoryCreatorProperties = [
    { name: 'name', label: 'Name', type: 'text' },
  ];

  useEffect(() => {
    fetch('/categories')
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
            properties={categoryCreatorProperties}
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
        <ul>
          {items.map(({ _id, name }) => (
            <li key={_id}>
              {name}{' '}
              <button
                onClick={() => {
                  if (window.confirm(`Delete the category "${name}"?`)) {
                    onDelete(_id);
                  }
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </>
    );
  }
};

export default Categories;
