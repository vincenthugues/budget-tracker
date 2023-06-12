import { getMonthNameFromDate } from './getMonthNameFromDate';

describe('getMonthNameFromDate', () => {
  it('returns the correct month name for a given date', () => {
    expect(getMonthNameFromDate(new Date('2023-06-15'))).toBe('June');
    expect(getMonthNameFromDate(new Date('2023-12-25'))).toBe('December');
  });
});
