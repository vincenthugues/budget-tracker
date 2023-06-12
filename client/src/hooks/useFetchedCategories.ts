import { useEffect, useState } from 'react';
import { Category } from '../types/Category';
import { useFetchedResource } from './useFetchedResource';

export function useFetchedCategories(): [
  categories?: Category[],
  setCategories?: (categories: Category[]) => void
] {
  const [categories, setCategories] = useState<Category[]>();
  const [fetchedCategories] = useFetchedResource<Category>('categories');

  useEffect(() => {
    setCategories(fetchedCategories);
  }, [fetchedCategories]);

  return [categories, setCategories];
}
