import { useEffect, useState } from 'react';

export function useFetchedResource<ResourceType>(
  url: string
): [
  fetchedResources: ResourceType[],
  isLoading: boolean,
  errorMessage?: string
] {
  const [items, setItems] = useState<ResourceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    fetch(`/${url}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoading(false);
          setItems(result);
        },
        (error) => {
          setIsLoading(false);
          setErrorMessage(error.message);
        }
      );
  }, [url]);

  return [items, isLoading, errorMessage];
}

export function useResourcesHandler<T extends { _id: string }>(
  fetchedResources: T[]
): [
  resources: T[],
  addItem: (newItem: T) => void,
  removeItemById: (itemId: string) => void
] {
  const [resources, setResources] = useState<T[]>(fetchedResources);

  useEffect(() => {
    setResources(fetchedResources);
  }, [fetchedResources]);

  const addItem = (newItem: T) => {
    setResources([...resources, newItem]);
  };

  const removeItemById = (itemId: string) => {
    setResources(resources.filter(({ _id }) => _id !== itemId));
  };

  return [resources, addItem, removeItemById];
}
