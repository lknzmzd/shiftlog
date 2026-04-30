"use client";

import { useState } from "react";

export default function WorkDayForm() {
  const [status, setStatus] = useState("");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Saving...");

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/work-days/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workDate: form.get("workDate"),
        hoursWorked: Number(form.get("hoursWorked")),
        note: form.get("note"),
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setStatus("Failed");
      return;
    }

    e.currentTarget.reset();
    setStatus("Saved");
  }

  return (
    <form onSubmit={save} className="panel">
      <h2>Add Work Day</h2>

      <input name="workDate" type="date" required />
      <input name="hoursWorked" type="number" step="0.01" placeholder="Hours worked" required />
      <textarea name="note" placeholder="Note" />

      <button className="btn" type="submit">Save Work Day</button>

      {status && <p className="muted">{status}</p>}
    </form>
  );
}