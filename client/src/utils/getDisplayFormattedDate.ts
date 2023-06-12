export const getDisplayFormattedDate = (date: Date): string =>
  new Date(date).toISOString().split('T')[0];
