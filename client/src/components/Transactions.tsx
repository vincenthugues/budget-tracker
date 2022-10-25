import { useEffect, useState } from 'react';

type Transaction = {
  _id: string;
  date: Date;
  amount: number;
};

const Transactions = (): JSX.Element => {
  const [items, setItems] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  useEffect(() => {
    fetch('/transactions')
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
        {items.map(({ _id, date, amount }) => (
          <li key={_id}>
            <>
              [{date}] {amount}
            </>
          </li>
        ))}
      </ul>
    );
  }
};

export default Transactions;
