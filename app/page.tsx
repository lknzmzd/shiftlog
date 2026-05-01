import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">SHIFTLOG</p>
        <h1>Track your salary and create work reports in seconds.</h1>

        <p className="muted">
          ShiftLog helps workers calculate monthly income, track work days,
          manage expenses, and generate copy-ready reports from templates.
        </p>

        <div className="actions">
          <Link className="btn" href="/signup">Start Free</Link>
          <Link className="btn secondary" href="/pricing">View Pricing</Link>
        </div>
      </section>

      <section className="grid-section">
        <div className="card">
          <h2>Salary tracking</h2>
          <p className="muted">Know how much you earned this month.</p>
        </div>

        <div className="card">
          <h2>Expense control</h2>
          <p className="muted">Compare income against monthly fixed costs.</p>
        </div>

        <div className="card">
          <h2>Work reports</h2>
          <p className="muted">Use templates and copy reports instantly.</p>
        </div>

        <div className="card">
          <h2>Worker-first</h2>
          <p className="muted">Simple enough to use during a real shift.</p>
        </div>
      </section>
    </main>
  );
}