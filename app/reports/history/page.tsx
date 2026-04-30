"use client";

import { useEffect, useState } from "react";

export default function History() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/reports/list")
      .then((r) => r.json())
      .then((d) => setData(d.data));
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>Reports</h1>

      {data.map((r) => (
        <pre key={r.id}>{r.final_text}</pre>
      ))}
    </main>
  );
}