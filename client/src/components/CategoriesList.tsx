import { useState } from 'react';
import { useFetchedResource } from '../hooks/useFetchedResource';
import { useResourcesHandler } from '../hooks/useResourcesHandler';
import { Category, CategoryDraft } from '../types/Category';
import { CreatorInput } from '../types/Creator';
import Creator from './Creator';
import DeleteButton from './DeleteButton';

const CategoryCreator = ({
  onAddCategory,
}: {
  onAddCategory: (category: Category) => void;
}) => {
  const [showCreator, setShowCreator] = useState(false);

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

    onAddCategory(createdCategory);
    setShowCreator(false);
  };

  const onCancel = () => {
    setShowCreator(false);
  };

  if (showCreator) {
    <Creator
      onSubmit={onSubmit}
      onCancel={onCancel}
      properties={categoryCreatorProperties}
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

const CategoriesList = (): JSX.Element => {
  const [fetchedCategories, isLoading, errorMessage] =
    useFetchedResource<Category>('categories');
  const [categories, addCategory, removeCategoryById] =
    useResourcesHandler(fetchedCategories);

  const getCategoryNameById = (categoryId: string): string | undefined =>
    categories?.find(({ _id }) => _id === categoryId)?.name;

  const onDelete = async (categoryId: string) => {
    await fetch(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
    removeCategoryById(categoryId);
  };

  if (errorMessage) {
    console.log(`Error: ${errorMessage}`);
    return <div>Error when fetching data</div>;
  } else if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <CategoryCreator onAddCategory={addCategory} />
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Parent category ID</th>
              <th>Is hidden</th>
              <th>Is deleted</th>
              <th>External ID</th>
              <th>Actions</th>
            </tr>
            {categories.map(
              ({
                _id,
                name,
                parentCategoryId,
                isHidden,
                isDeleted,
                externalId,
              }) => (
                <tr key={_id}>
                  <td>{name}</td>
                  <td>
                    {parentCategoryId
                      ? getCategoryNameById(parentCategoryId)
                      : '-'}
                  </td>
                  <td>{isHidden ? 'Yes' : 'No'}</td>
                  <td>{isDeleted ? 'Yes' : 'No'}</td>
                  <td className="ellipsisCell">{externalId}</td>
                  <td>
                    <DeleteButton
                      confirmationMessage={`Delete the category "${name}"?`}
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
  }
};

export default CategoriesList;
