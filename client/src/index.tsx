import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AccountsList from './components/AccountsList';
import BudgetsList from './components/BudgetsList';
import CategoriesList from './components/CategoriesList';
import PayeesList from './components/PayeesList';
import TransactionsList from './components/TransactionsList';
import ErrorPage from './error-page';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'accounts',
        element: <AccountsList />,
      },
      {
        path: 'budgets',
        element: <BudgetsList />,
      },
      {
        path: 'categories',
        element: <CategoriesList />,
      },
      {
        path: 'payees',
        element: <PayeesList />,
      },
      {
        path: 'transactions',
        element: <TransactionsList />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
