import { useQuery } from '@tanstack/react-query';
import { Category } from '../types/Category';

const fetchCategories = async (): Promise<Category[]> => {
  const url = '/categories';
  const res = await fetch(url);
  const categories = await res.json();

  return categories;
};

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
