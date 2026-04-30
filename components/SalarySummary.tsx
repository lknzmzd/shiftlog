"use client";

import { useState } from "react";
import StatCard from "./StatCard";

export default function SalarySummary() {
  const [result, setResult] = useState<any>(null);

  async function calculate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const payload = {
      hourlyRate: Number(form.get("hourlyRate")),
      hoursPerDay: Number(form.get("hoursPerDay")),
      workingDays: Number(form.get("workingDays")),
      workedDays: Number(form.get("workedDays")),
      fixedExpenses: Number(form.get("fixedExpenses")),
    };

    const res = await fetch("/api/salary/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setResult(data.result);
  }

  return (
    <section className="grid-section">
      <form onSubmit={calculate} className="panel">
        <h2>Calculate Month</h2>

        <input name="hourlyRate" type="number" step="0.01" placeholder="Hourly rate" required />
        <input name="hoursPerDay" type="number" step="0.01" placeholder="Hours per day" required />
        <input name="workingDays" type="number" step="1" placeholder="Working days this month" required />
        <input name="workedDays" type="number" step="1" placeholder="Worked days so far" required />
        <input name="fixedExpenses" type="number" step="0.01" placeholder="Fixed monthly expenses" required />

        <button className="btn" type="submit">Calculate</button>
      </form>

      <div className="stats">
        <StatCard label="Monthly Income" value={result ? `${result.monthly.toFixed(2)} €` : "—"} />
        <StatCard label="Earned So Far" value={result ? `${result.earned.toFixed(2)} €` : "—"} />
        <StatCard label="Remaining" value={result ? `${result.remaining.toFixed(2)} €` : "—"} />
        <StatCard label="After Expenses" value={result ? `${result.afterExpenses.toFixed(2)} €` : "—"} />
      </div>
    </section>
  );
}