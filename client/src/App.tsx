import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './App.css';
import { AccountsContext, CategoriesContext, PayeesContext } from './contexts';
import { useFetchedAccounts } from './hooks/useFetchedAccounts';
import { useFetchedCategories } from './hooks/useFetchedCategories';
import { useFetchedPayees } from './hooks/useFetchedPayees';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactElement }) => {
  const [accounts, setAccounts] = useFetchedAccounts();
  const [categories, setCategories] = useFetchedCategories();
  const [payees, setPayees] = useFetchedPayees();

  return (
    <QueryClientProvider client={queryClient}>
      <CategoriesContext.Provider
        value={{
          categories,
          setCategories,
        }}
      >
        <AccountsContext.Provider
          value={{
            accounts,
            setAccounts,
          }}
        >
          <PayeesContext.Provider
            value={{
              payees,
              setPayees,
            }}
          >
            {children}
          </PayeesContext.Provider>
        </AccountsContext.Provider>
      </CategoriesContext.Provider>
    </QueryClientProvider>
  );
};

const App = () => (
  <div id="App">
    <header id="App-header">
      <h1>Budget Tracker</h1>
      <nav>
        <ul>
          <li>
            <Link to="">Current Month</Link>
          </li>
          <li>
            <Link to="budgets">Budgets</Link>
          </li>
          <li>
            <Link to="accounts">Accounts</Link>
          </li>
          <li>
            <Link to="categories">Categories</Link>
          </li>
          <li>
            <Link to="payees">Payees</Link>
          </li>
          <li>
            <Link to="transactions">Transactions</Link>
          </li>
        </ul>
      </nav>
    </header>
    <div id="App-content">
      <Providers>
        <Outlet />
      </Providers>
    </div>
  </div>
);

export default App;
