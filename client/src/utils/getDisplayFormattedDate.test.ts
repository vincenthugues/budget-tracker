import { getDisplayFormattedDate } from './getDisplayFormattedDate';

describe('getDisplayFormattedDate', () => {
  it('formats the date correctly', () => {
    const date = new Date('2023-06-12T10:30:00Z');
    const formattedDate = getDisplayFormattedDate(date);
    expect(formattedDate).toBe('2023-06-12');
  });
});
