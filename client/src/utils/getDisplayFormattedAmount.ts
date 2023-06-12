export const getDisplayFormattedAmount = (amount: number): string =>
  new Intl.NumberFormat(
    'en-US', // fr-FR
    { style: 'currency', currency: 'EUR' }
  ).format(amount / 100);
