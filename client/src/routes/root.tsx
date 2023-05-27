import { Link, Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <>
      <div id="sidebar">
        <h1>Budget Tracker</h1>
        <nav>
          <ul>
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
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
