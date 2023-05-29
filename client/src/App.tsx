import { Link, Outlet } from 'react-router-dom';
import './App.css';

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
      <Outlet />
    </div>
  </div>
);

export default App;
