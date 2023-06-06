export const getDisplayFormattedDate = (date: Date): string =>
  new Date(date).toISOString().split('T')[0];

export const getDisplayFormattedAmount = (amount: number): string =>
  new Intl.NumberFormat(
    'en-US', // fr-FR
    { style: 'currency', currency: 'EUR' }
  ).format(amount / 100);

export const getInputCurrentDateTime = () =>
  new Date().toISOString().split('.')[0];

export enum Order {
  ASC,
  DESC,
}

export const sortByDate = (
  arr: { date: Date | string }[],
  order: Order = Order.ASC
): { date: Date | string }[] => {
  arr.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return order === Order.ASC ? dateA - dateB : dateB - dateA;
  });
  return arr;
};
