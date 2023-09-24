import { CategoryCreator } from '../components/CategoriesList';
import DeleteButton from '../components/DeleteButton';
import { useCategories } from '../hooks/useCategories';
import { useResourcesHandler } from '../hooks/useResourcesHandler';

export const CategoriesPage = (): JSX.Element => {
  const {
    categories: fetchedCategories = [],
    isLoading,
    error,
  } = useCategories();
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

  if (error) {
    console.log(`Error: ${error}`);
    return <div>Error when fetching data</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
};
