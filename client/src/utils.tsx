export const getDisplayFormattedDate = (date: Date): string =>
  new Date(date).toISOString().split('T')[0];

export const getDisplayFormattedAmount = (amount: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount / 100);

export const getInputCurrentDateTime = () =>
  new Date().toISOString().split('.')[0];
