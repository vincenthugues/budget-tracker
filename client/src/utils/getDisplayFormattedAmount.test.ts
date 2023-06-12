import { getDisplayFormattedAmount } from './getDisplayFormattedAmount';

describe('getDisplayFormattedAmount', () => {
  it('formats the amount correctly for positive values', () => {
    const amount = 12345;
    const formattedAmount = getDisplayFormattedAmount(amount);
    expect(formattedAmount).toBe('€123.45');
  });

  it('formats the amount correctly for negative values', () => {
    const amount = -67890;
    const formattedAmount = getDisplayFormattedAmount(amount);
    expect(formattedAmount).toBe('-€678.90');
  });

  it('formats the amount correctly for zero', () => {
    const amount = 0;
    const formattedAmount = getDisplayFormattedAmount(amount);
    expect(formattedAmount).toBe('€0.00');
  });
});
