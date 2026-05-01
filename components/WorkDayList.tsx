"use client";

import { useEffect, useState } from "react";

export default function WorkDayList() {
  const [data, setData] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");

  function load() {
    fetch("/api/work-days/list")
      .then((r) => r.json())
      .then((d) => setData(d.data || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    await fetch("/api/work-days/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    load();
  }

  function startEdit(item: any) {
    setEditing(item.id);
    setHours(item.hours_worked);
    setNote(item.note || "");
  }

  async function saveEdit(id: string) {
    await fetch("/api/work-days/update", {
      method: "POST",
      body: JSON.stringify({
        id,
        hoursWorked: Number(hours),
        note,
      }),
    });

    setEditing(null);
    load();
  }

  return (
    <div className="panel">
      <h2>Work Days</h2>

      {data.map((d) => (
        <div key={d.id} className="report-card">
          <strong>{d.work_date}</strong>

          {editing === d.id ? (
            <>
              <input
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <button className="btn" onClick={() => saveEdit(d.id)}>
                Save
              </button>
            </>
          ) : (
            <>
              <p>{d.hours_worked} hours</p>
              <p className="muted">{d.note}</p>

              <button className="btn secondary" onClick={() => startEdit(d)}>
                Edit
              </button>
            </>
          )}

          <button className="btn secondary" onClick={() => remove(d.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}