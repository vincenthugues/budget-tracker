import { useEffect, useState } from 'react';

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
