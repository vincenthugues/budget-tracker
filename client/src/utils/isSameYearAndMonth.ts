export const isSameYearAndMonth =
  (targetYear: number, targetMonth: number) =>
  ({ date }: { date: Date }): boolean => {
    const [year, month] = new Date(date).toISOString().split('-');
    return Number(year) === targetYear && Number(month) === targetMonth;
  };
