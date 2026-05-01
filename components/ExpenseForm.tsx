"use client";

import { useState } from "react";

export default function ExpenseForm() {
  const [status, setStatus] = useState("");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Saving...");

    const form = new FormData(e.currentTarget);

    const payload = {
      title: String(form.get("title") || ""),
      amount: Number(form.get("amount") || 0),
      expenseMonth: String(form.get("expenseMonth") || ""),
    };

    const res = await fetch("/api/expenses/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      setStatus("Failed");
      return;
    }

    e.currentTarget.reset();
    setStatus("Expense saved");
  }

  return (
    <form onSubmit={save} className="panel">
      <h2>Add Expense</h2>

      <input name="title" placeholder="Expense title" required />
      <input name="amount" type="number" step="0.01" placeholder="Amount" required />
      <input name="expenseMonth" type="month" required />

      <button className="btn" type="submit">
        Save Expense
      </button>

      {status && <p className="muted">{status}</p>}
    </form>
  );
}