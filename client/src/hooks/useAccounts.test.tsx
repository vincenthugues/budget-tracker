import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useAccounts } from './useAccounts';

const mockAccounts = [{ _id: 'account001' }, { _id: 'account002' }];
jest.mock('../api', () => ({
  fetchAccounts: () => mockAccounts,
}));

describe('useAccounts', () => {
  it('uses accounts', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: any }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAccounts(), { wrapper });

    await waitFor(() => expect(result.current.accounts).toBe(mockAccounts));
  });
});
