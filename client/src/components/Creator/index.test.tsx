import { render, screen } from '@testing-library/react';
import Creator from '.';

it('renders the Creator with Submit and Cancel buttons', () => {
  render(<Creator onSubmit={() => {}} onCancel={() => {}} properties={[]} />);
  const submit = screen.getByText(/Submit/i);
  const cancel = screen.getByText(/Cancel/i);

  expect(submit).toBeInTheDocument();
  expect(cancel).toBeInTheDocument();
});
