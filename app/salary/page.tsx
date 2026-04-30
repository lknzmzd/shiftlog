"use client";

import { useState } from "react";

export default function SalaryPage() {
  const [result, setResult] = useState<any>(null);

  async function calculate(e: any) {
    e.preventDefault();

    const form = new FormData(e.target);

    const res = await fetch("/api/salary/calculate", {
      method: "POST",
      body: JSON.stringify({
        hourlyRate: Number(form.get("hourlyRate")),
        hoursPerDay: Number(form.get("hoursPerDay")),
        workingDays: Number(form.get("workingDays")),
        workedDays: Number(form.get("workedDays")),
        fixedExpenses: Number(form.get("fixedExpenses")),
      }),
    });

    const data = await res.json();
    setResult(data.result);
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Salary</h1>

      <form onSubmit={calculate}>
        <input name="hourlyRate" placeholder="Hourly" /><br />
        <input name="hoursPerDay" placeholder="Hours/day" /><br />
        <input name="workingDays" placeholder="Days/month" /><br />
        <input name="workedDays" placeholder="Worked days" /><br />
        <input name="fixedExpenses" placeholder="Expenses" /><br />
        <button>Calculate</button>
      </form>

      {result && (
        <div>
          <p>Monthly: {result.monthly}</p>
          <p>Earned: {result.earned}</p>
          <p>Remaining: {result.remaining}</p>
          <p>After Expenses: {result.afterExpenses}</p>
        </div>
      )}
    </main>
  );
}