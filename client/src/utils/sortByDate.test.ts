import { SortingOrder, sortByDate } from './sortByDate';

describe('sortByDate', () => {
  it('sorts array in ascending order by date', () => {
    const arr = [
      { date: '2023-06-01' },
      { date: '2023-06-05' },
      { date: '2023-06-03' },
    ];
    const sortedArr = sortByDate(arr);
    expect(sortedArr).toEqual([
      { date: '2023-06-01' },
      { date: '2023-06-03' },
      { date: '2023-06-05' },
    ]);
  });

  it('sorts array in descending order by date', () => {
    const arr = [
      { date: '2023-06-01' },
      { date: '2023-06-05' },
      { date: '2023-06-03' },
    ];
    const sortedArr = sortByDate(arr, SortingOrder.DESC);
    expect(sortedArr).toEqual([
      { date: '2023-06-05' },
      { date: '2023-06-03' },
      { date: '2023-06-01' },
    ]);
  });

  it('returns an empty array for an empty input', () => {
    const arr: { date: Date | string }[] = [];
    const sortedArr = sortByDate(arr);
    expect(sortedArr).toEqual([]);
  });

  it('returns the same array for an input with a single element', () => {
    const arr = [{ date: '2023-06-01' }];
    const sortedArr = sortByDate(arr);
    expect(sortedArr).toEqual([{ date: '2023-06-01' }]);
  });

  it('sorts array correctly when there are duplicate dates', () => {
    const arr = [
      { date: '2023-06-01' },
      { date: '2023-06-05' },
      { date: '2023-06-03' },
      { date: '2023-06-01' },
      { date: '2023-06-05' },
    ];
    const sortedArr = sortByDate(arr);
    expect(sortedArr).toEqual([
      { date: '2023-06-01' },
      { date: '2023-06-01' },
      { date: '2023-06-03' },
      { date: '2023-06-05' },
      { date: '2023-06-05' },
    ]);
  });

  it('sorts array correctly for all date formats', () => {
    const arr = [
      { date: '2023-06-01' },
      { date: new Date('2023-06-05') },
      { date: '2023-06-03T10:00:00' },
    ];
    const sortedArr = sortByDate(arr, SortingOrder.DESC);
    expect(sortedArr).toEqual([
      { date: new Date('2023-06-05') },
      { date: '2023-06-03T10:00:00' },
      { date: '2023-06-01' },
    ]);
  });
});
