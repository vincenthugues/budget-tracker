import { render, screen } from '@testing-library/react';
import App from './App';

test.skip('renders the Budget Tracker app', () => {
  render(<App />);
  const title = screen.getByText(/Budget Tracker/i);
  expect(title).toBeInTheDocument();
});
