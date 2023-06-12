import { isSameYearAndMonth } from './isSameYearAndMonth';

describe('isSameYearAndMonth', () => {
  it('returns true for the same year and month', () => {
    const targetYear = 2023;
    const targetMonth = 6;
    const date = new Date('2023-06-15');
    const checkYearAndMonth = isSameYearAndMonth(targetYear, targetMonth);

    const result = checkYearAndMonth({ date });

    expect(result).toBe(true);
  });

  it('returns false for different year', () => {
    const targetYear = 2023;
    const targetMonth = 6;
    const date = new Date('2022-06-15');
    const checkYearAndMonth = isSameYearAndMonth(targetYear, targetMonth);

    const result = checkYearAndMonth({ date });

    expect(result).toBe(false);
  });

  it('returns false for different month', () => {
    const targetYear = 2023;
    const targetMonth = 6;
    const date = new Date('2023-07-15');
    const checkYearAndMonth = isSameYearAndMonth(targetYear, targetMonth);

    const result = checkYearAndMonth({ date });

    expect(result).toBe(false);
  });
});
