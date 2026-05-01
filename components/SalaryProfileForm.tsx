"use client";

import { useState } from "react";

export default function SalaryProfileForm() {
  const [status, setStatus] = useState("");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Saving...");

    const form = new FormData(e.currentTarget);

    const payload = {
      hourlyRate: Number(form.get("hourlyRate")),
      hoursPerDay: Number(form.get("hoursPerDay")),
      workingDaysPerMonth: Number(form.get("workingDaysPerMonth")),
      fixedExpenses: Number(form.get("fixedExpenses")),
      currency: String(form.get("currency") || "EUR"),
    };

    const res = await fetch("/api/salary/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      setStatus("Failed to save profile");
      return;
    }

    setStatus("Salary profile saved");
  }

  return (
    <form onSubmit={save} className="panel">
      <h2>Save Salary Profile</h2>

      <input name="hourlyRate" type="number" step="0.01" placeholder="Hourly rate" required />
      <input name="hoursPerDay" type="number" step="0.01" placeholder="Hours per day" required />
      <input name="workingDaysPerMonth" type="number" step="1" placeholder="Working days/month" required />
      <input name="fixedExpenses" type="number" step="0.01" placeholder="Fixed expenses" required />
      <input name="currency" placeholder="Currency" defaultValue="EUR" />

      <button className="btn" type="submit">Save Profile</button>

      {status && <p className="muted">{status}</p>}
    </form>
  );
}