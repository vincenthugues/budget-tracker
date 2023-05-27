import { useEffect, useState } from 'react';
import Creator, { CreatorInput } from './Creator';

type CategoryDraft = {
  _id: string;
  name: string;
  parentCategoryId?: string;
  isHidden?: boolean;
  isDeleted?: boolean;
  externalId?: string;
};

type Category = CategoryDraft & { _id: string };

const CategoriesList = (): JSX.Element => {
  const [items, setItems] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [showCreator, setShowCreator] = useState(false);

  const onSubmit = async (categoryToCreate: CategoryDraft) => {
    const response = await fetch('/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryToCreate),
    });
    const createdCategory = await response.json();

    if (createdCategory.error) {
      console.error(
        `Error (${createdCategory.statusCode}: ${createdCategory.error}) while creating the resource: `,
        createdCategory.message.join(', ')
      );
      return;
    }

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
  const categoryCreatorProperties: CreatorInput[] = [
    { name: 'name', label: 'Name', type: 'text' },
    {
      name: 'parentCategoryId',
      label: 'Parent category ID',
      type: 'text',
      isOptional: true,
    },
    {
      name: 'isHidden',
      label: 'Is hidden',
      type: 'checkbox',
      isOptional: true,
    },
    {
      name: 'isDeleted',
      label: 'Is deleted',
      type: 'checkbox',
      isOptional: true,
    },
    {
      name: 'externalId',
      label: 'External ID',
      type: 'text',
      isOptional: true,
    },
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
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Parent category ID</th>
              <th>Is hidden</th>
              <th>Is deleted</th>
              <th>External ID</th>
              <th></th>
            </tr>
            {items.map(
              ({
                _id,
                name,
                parentCategoryId,
                isHidden,
                isDeleted,
                externalId,
              }) => (
                <tr key={_id}>
                  <td>{_id}</td>
                  <td>{name}</td>
                  <td>{parentCategoryId}</td>
                  <td>{isHidden ? 'Yes' : 'No'}</td>
                  <td>{isDeleted ? 'Yes' : 'No'}</td>
                  <td>{externalId}</td>
                  <td>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete the category "${name}"?`)) {
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

export default CategoriesList;
