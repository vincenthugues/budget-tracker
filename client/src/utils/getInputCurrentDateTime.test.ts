import { getInputCurrentDateTime } from './getInputCurrentDateTime';

describe('getInputCurrentDateTime', () => {
  it('returns the current date and time in the expected format', () => {
    const originalDate = Date;
    const mockDateValue = new Date(
      'Mon Jun 12 2023 10:30:00 GMT+0200 (Central European Summer Time)'
    );

    // Mock the Date object to return a specific value
    const mockDate = jest
      .spyOn(globalThis, 'Date')
      .mockImplementation(() => mockDateValue as any);

    const expectedDateTime = '2023-06-12T10:30:00';
    const result = getInputCurrentDateTime();

    expect(result).toBe(expectedDateTime);

    // Restore the original Date object
    mockDate.mockRestore();
    globalThis.Date = originalDate;
  });
});
