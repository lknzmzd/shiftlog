import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";

export default function ExpensesPage() {
  return (
    <main className="page">
      <h1>Expenses</h1>

      <section className="grid-section">
        <ExpenseForm />
        <ExpenseList />
      </section>
    </main>
  );
}