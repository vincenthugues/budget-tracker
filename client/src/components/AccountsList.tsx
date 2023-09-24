import { useState } from 'react';
import { createAccount } from '../api';
import { Account, AccountDraft, AccountType } from '../types/Account';
import { CreatorInput } from '../types/Creator';
import Creator from './Creator';

export const AccountCreator = ({
  onAddAccount,
}: {
  onAddAccount: (account: Account) => void;
}) => {
  const [showCreator, setShowCreator] = useState(false);

  const accountCreatorProperties: CreatorInput[] = [
    { name: 'name', label: 'Name', type: 'text' },
    {
      name: 'externalId',
      label: 'External Id',
      type: 'text',
      isOptional: true,
    },
    {
      name: 'type',
      label: 'Type',
      type: 'text',
      isOptional: true,
      options: Object.entries(AccountType),
    },
    {
      name: 'isClosed',
      label: 'Is closed',
      type: 'checkbox',
      isOptional: true,
    },
    { name: 'balance', label: 'Balance', type: 'number', isOptional: true },
  ];

  const onSubmit = async (accountToCreate: AccountDraft) => {
    const convertAccountBalanceToCents = ({
      balance,
      ...otherProperties
    }: AccountDraft): AccountDraft => ({
      balance: (balance || 0) * 100,
      ...otherProperties,
    });

    const createdAccount = await createAccount(
      convertAccountBalanceToCents(accountToCreate)
    );

    if (createdAccount.message) {
      console.error(
        `Error ${createdAccount.statusCode} while creating the resource: ${createdAccount.message}`
      );
      return;
    }

    onAddAccount(createdAccount);
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
        properties={accountCreatorProperties}
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
