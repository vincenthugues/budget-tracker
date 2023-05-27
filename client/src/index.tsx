import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './error-page';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Accounts from './routes/accounts';
import Budgets from './routes/budgets';
import Categories from './routes/categories';
import Payees from './routes/payees';
import Root from './routes/root';
import Transactions from './routes/transactions';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'accounts',
        element: <Accounts />,
      },
      {
        path: 'budgets',
        element: <Budgets />,
      },
      {
        path: 'categories',
        element: <Categories />,
      },
      {
        path: 'payees',
        element: <Payees />,
      },
      {
        path: 'transactions',
        element: <Transactions />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
