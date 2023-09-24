import { useState } from 'react';
import { createPayee } from '../api';
import { CreatorInput } from '../types/Creator';
import { Payee, PayeeDraft } from '../types/Payee';
import Creator from './Creator';

export const PayeeCreator = ({
  onAddPayee,
}: {
  onAddPayee: (payee: Payee) => void;
}) => {
  const [showCreator, setShowCreator] = useState(false);

  const payeeCreatorProperties: CreatorInput[] = [
    { name: 'name', label: 'Name', type: 'text' },
    {
      name: 'externalId',
      label: 'External ID',
      type: 'text',
      isOptional: true,
    },
  ];

  const onSubmit = async (payeeToCreate: PayeeDraft) => {
    const createdPayee = await createPayee(payeeToCreate);

    if (createdPayee.message) {
      console.error(
        `Error ${createdPayee.statusCode} while creating the resource: ${createdPayee.message}`
      );
      return;
    }

    onAddPayee(createdPayee);
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
        properties={payeeCreatorProperties}
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
