"use client";

import { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  date: string;
  rawText: string;
  outText: string;
  rows: any[];
  createdAt: string;
};

export default function WarehouseHistoryClient() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  function load() {
    setItems(JSON.parse(localStorage.getItem("shiftlog_warehouse_history") || "[]"));
  }

  useEffect(() => {
    load();
  }, []);

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
  }

  function clearHistory() {
    localStorage.removeItem("shiftlog_warehouse_history");
    load();
  }

  return (
    <div className="warehouse-legacy">
      <header className="warehouse-header">
        <div>
          <h1>Warehouse History</h1>
          <p>Saved in browser localStorage for quick testing. Server history can come later.</p>
        </div>
        <button className="btn secondary" onClick={clearHistory}>Clear history</button>
      </header>

      <main className="page">
        <div className="panel">
          {items.length === 0 && <p className="muted">No saved warehouse runs yet.</p>}
          <div className="report-list">
            {items.map((item) => (
              <div key={item.id} className="report-card">
                <strong>{item.date} · {item.rows?.length || 0} row(s)</strong>
                <p className="muted small">{new Date(item.createdAt).toLocaleString()}</p>
                <pre>{item.outText}</pre>
                <button className="btn secondary" onClick={() => copy(item.outText)}>Copy TSV</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
