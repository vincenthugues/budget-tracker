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
