"use client";

import { useEffect, useState } from "react";

export default function ExpenseList() {
  const [data, setData] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  function load() {
    fetch("/api/expenses/list")
      .then((r) => r.json())
      .then((d) => setData(d.data || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    await fetch("/api/expenses/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    load();
  }

  function startEdit(item: any) {
    setEditing(item.id);
    setTitle(item.title);
    setAmount(item.amount);
  }

  async function saveEdit(id: string) {
    await fetch("/api/expenses/update", {
      method: "POST",
      body: JSON.stringify({
        id,
        title,
        amount: Number(amount),
      }),
    });

    setEditing(null);
    load();
  }

  return (
    <div className="panel">
      <h2>Expenses</h2>

      {data.map((e) => (
        <div key={e.id} className="report-card">
          {editing === e.id ? (
            <>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <button className="btn" onClick={() => saveEdit(e.id)}>
                Save
              </button>
            </>
          ) : (
            <>
              <strong>{e.title}</strong>
              <p>{e.amount}</p>

              <button className="btn secondary" onClick={() => startEdit(e)}>
                Edit
              </button>
            </>
          )}

          <button className="btn secondary" onClick={() => remove(e.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}