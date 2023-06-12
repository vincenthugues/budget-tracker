import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api';
import { Category } from '../types/Category';

export const useCategories = (): {
  categories?: Category[];
  isLoading: boolean;
  error?: unknown;
} => {
  const { data, isLoading, error } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  return { categories: data, isLoading, error };
};
