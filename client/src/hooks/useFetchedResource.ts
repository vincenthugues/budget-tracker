import { useEffect, useState } from 'react';

export function useFetchedResource<ResourceType>(
  url: string
): [
  fetchedResource: ResourceType[],
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
          setErrorMessage(`fetch "${url}": ${error.message}`);
        }
      );
  }, [url]);

  return [items, isLoading, errorMessage];
}
