export const getMonthNameFromDate = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};
