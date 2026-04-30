import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">SHIFTLOG V1</p>
        <h1>Track salary. Build reports. Copy fast.</h1>
        <p className="muted">
          A simple worker tool for monthly income tracking, work-day logging,
          and copy-ready work reports.
        </p>

        <div className="actions">
          <Link className="btn" href="/dashboard">Open Dashboard</Link>
          <Link className="btn secondary" href="/reports/new">Create Report</Link>
        </div>
      </section>
    </main>
  );
}