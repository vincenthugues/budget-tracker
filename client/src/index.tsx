import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import AccountsList from './components/AccountsList';
import CategoriesList from './components/CategoriesList';
import MonthBudget from './components/MonthBudget';
import PayeesList from './components/PayeesList';
import TransactionsList from './components/TransactionsList';
import ErrorPage from './error-page';
import './index.css';
import { BudgetsPage } from './pages/BudgetsPage';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <MonthBudget />,
      },
      {
        path: 'accounts',
        element: <AccountsList />,
      },
      {
        path: 'budgets',
        element: <BudgetsPage />,
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
