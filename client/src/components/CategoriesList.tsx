import { useState } from 'react';
import { createCategory } from '../api';
import { Category, CategoryDraft } from '../types/Category';
import { CreatorInput } from '../types/Creator';
import Creator from './Creator';

export const CategoryCreator = ({
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
    const createdCategory = await createCategory(categoryToCreate);

    if (createdCategory.message) {
      console.error(
        `Error ${createdCategory.statusCode} while creating the resource: ${createdCategory.message}`
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
    return (
      <Creator
        onSubmit={onSubmit}
        onCancel={onCancel}
        properties={categoryCreatorProperties}
      />
    );
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
