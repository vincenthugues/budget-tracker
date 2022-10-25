import { useEffect, useState } from 'react';

type Category = {
  _id: string;
  name: string;
};

const Categories = (): JSX.Element => {
  const [items, setItems] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

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
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        {items.map(({ _id, name }) => (
          <li key={_id}>{name}</li>
        ))}
      </ul>
    );
  }
};

export default Categories;
