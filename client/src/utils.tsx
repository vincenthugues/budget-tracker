export const getDisplayFormattedDate = (date: Date): string =>
  new Date(date).toISOString().split('T')[0];

export const getDisplayFormattedAmount = (amount: number): string =>
  new Intl.NumberFormat(
    'en-US', // fr-FR
    { style: 'currency', currency: 'EUR' }
  ).format(amount / 100);

export const getInputCurrentDateTime = () => {
  const datetime = new Date();
  datetime.setMinutes(datetime.getMinutes() - datetime.getTimezoneOffset());
  datetime.setMilliseconds(0);

  return datetime.toISOString().slice(0, -1);
};

export enum SortingOrder {
  ASC,
  DESC,
}

export const sortByDate = (
  arr: { date: Date | string }[],
  order: SortingOrder = SortingOrder.ASC
): { date: Date | string }[] => {
  return [...arr].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return order === SortingOrder.ASC ? dateA - dateB : dateB - dateA;
  });
};
