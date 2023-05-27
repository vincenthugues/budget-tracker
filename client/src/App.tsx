import './App.css';
import AccountsList from './components/AccountsList';
import BudgetsList from './components/BudgetsList';
import CategoriesList from './components/CategoriesList';
import PayeesList from './components/PayeesList';
import TransactionsList from './components/TransactionsList';

const MainView = () => (
  <div className="App">
    <header className="App-header">
      <p>Budget Tracker</p>
    </header>

    <h2>Budgets</h2>
    <BudgetsList />

    <h2>Accounts</h2>
    <AccountsList />

    <h2>Categories</h2>
    <CategoriesList />

    <h2>Payees</h2>
    <PayeesList />

    <h2>Transactions</h2>
    <TransactionsList />
  </div>
);

const App = () => <MainView />;

export default App;
