import SalaryProfileForm from "@/components/SalaryProfileForm";
import SalarySummary from "@/components/SalarySummary";

export default function SalaryPage() {
  return (
    <main className="page">
      <h1>Salary</h1>

      <section className="grid-section">
        <SalaryProfileForm />
        <SalarySummary />
      </section>
    </main>
  );
}