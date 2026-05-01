"use client";

import { useState } from "react";

export default function WorkplaceForm() {
  const [status, setStatus] = useState("");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Saving...");

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/workplaces/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: String(form.get("name") || ""),
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setStatus("Failed");
      return;
    }

    e.currentTarget.reset();
    setStatus("Workplace saved");
  }

  return (
    <form onSubmit={save} className="panel">
      <h2>Add Workplace</h2>

      <input name="name" placeholder="Workplace name" required />

      <button className="btn" type="submit">
        Save Workplace
      </button>

      {status && <p className="muted">{status}</p>}
    </form>
  );
}