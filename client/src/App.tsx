import "./App.css";
import Accounts from "./components/Accounts";
import Budgets from "./components/Budgets";
import Categories from "./components/Categories";
import Transactions from "./components/Transactions";
import Payees from "./components/Payees";

const App = () => (
  <div className="App">
    <header className="App-header">
      <p>Budget Tracker</p>
    </header>

    <h2>Budgets</h2>
    <Budgets />

    <h2>Accounts</h2>
    <Accounts />

    <h2>Categories</h2>
    <Categories />

    <h2>Payees</h2>
    <Payees />

    <h2>Transactions</h2>
    <Transactions />
  </div>
);

export default App;
