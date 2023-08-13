import { BudgetCreator, BudgetsTable } from '../components/BudgetsTable';
import { useBudgets } from '../hooks/useBudgets';
import { useResourcesHandler } from '../hooks/useResourcesHandler';

export const BudgetsPage = (): JSX.Element => {
  const { budgets: fetchedBudgets, isLoading, error } = useBudgets();
  const [budgets, addBudget, removeBudgetById] = useResourcesHandler(
    fetchedBudgets || []
  );

  const onDelete = async (budgetId: string) => {
    await fetch(`/budgets/${budgetId}`, {
      method: 'DELETE',
    });
    removeBudgetById(budgetId);
  };

  if (error) {
    console.log(`Error: ${error}`);
    return <div>Error when fetching data</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BudgetCreator onAddBudget={addBudget} />
      <BudgetsTable budgets={budgets} onDelete={onDelete} />
    </>
  );
};
