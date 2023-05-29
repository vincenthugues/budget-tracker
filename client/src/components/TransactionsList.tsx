import { useEffect, useState } from 'react';
import {
  getDisplayFormattedAmount,
  getDisplayFormattedDate,
  getInputCurrentDateTime,
} from '../utils';
import Creator, { CreatorInput } from './Creator';

type TransactionDraft = {
  date: Date;
  amount: number;
  accountId: string;
  payeeId: string;
  categoryId?: string;
};

type Transaction = TransactionDraft & { _id: string };

const TransactionCreator = ({
  onAddTransaction,
}: {
  onAddTransaction: (transaction: Transaction) => void;
}) => {
  const [showCreator, setShowCreator] = useState(false);

  const transactionCreatorProperties: CreatorInput[] = [
    {
      name: 'date',
      label: 'Date',
      type: 'datetime-local',
      defaultValue: getInputCurrentDateTime(),
    },
    { name: 'amount', label: 'Amount', type: 'number' },
    { name: 'accountId', label: 'Account ID', type: 'string' },
    { name: 'payeeId', label: 'Payee ID', type: 'string' },
    {
      name: 'categoryId',
      label: 'Category ID',
      type: 'string',
      isOptional: true,
    },
  ];

  const onSubmit = async (transactionToCreate: TransactionDraft) => {
    const convertTransactionAmountToCents = ({
      amount,
      ...otherProperties
    }: TransactionDraft) => ({
      amount: amount * 100,
      ...otherProperties,
    });

    const response = await fetch('/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        convertTransactionAmountToCents(transactionToCreate)
      ),
    });
    const createdTransaction = await response.json();

    if (createdTransaction.error) {
      console.error(
        `Error (${createdTransaction.statusCode}: ${createdTransaction.error}) while creating the resource: `,
        createdTransaction.message.join(', ')
      );
      return;
    }

    onAddTransaction(createdTransaction);
    setShowCreator(false);
  };

  const onCancel = () => {
    setShowCreator(false);
  };

  return (
    <>
      {showCreator ? (
        <Creator
          onSubmit={onSubmit}
          onCancel={onCancel}
          properties={transactionCreatorProperties}
        />
      ) : (
        <button
          onClick={() => {
            setShowCreator(true);
          }}
        >
          ➕
        </button>
      )}
    </>
  );
};

const TransactionsList = (): JSX.Element => {
  const [items, setItems] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const addItem = (newItem: Transaction) => {
    setItems([...items, newItem]);
  };

  const onDelete = async (transactionId: string) => {
    await fetch(`/transactions/${transactionId}`, {
      method: 'DELETE',
    });
    setItems(items.filter(({ _id }) => _id !== transactionId));
  };

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
    console.log(`Error: ${error.message}`);
    return <div>Error when fetching data</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <TransactionCreator onAddTransaction={addItem} />
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Account</th>
              <th>Category</th>
              <th>Payee</th>
              <th>Amount</th>
              <th></th>
            </tr>
            {items.map(
              ({ _id, date, amount, accountId, payeeId, categoryId }) => (
                <tr key={_id}>
                  <td>{_id}</td>
                  <td>{getDisplayFormattedDate(date)}</td>
                  <td>{accountId}</td>
                  <td>{payeeId}</td>
                  <td>{categoryId}</td>
                  <td>{getDisplayFormattedAmount(amount)}</td>
                  <td>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete the transaction "[${date}] ${amount}"?`
                          )
                        ) {
                          onDelete(_id);
                        }
                      }}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </>
    );
  }
};

export default TransactionsList;
