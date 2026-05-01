"use client";

import { useEffect, useState } from "react";
import StatCard from "./StatCard";

export default function DashboardSummary() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/dashboard/summary?month=${month}`)
      .then((res) => res.json())
      .then((json) => setData(json.data));
  }, [month]);

  if (!data) return <p className="muted">Loading dashboard...</p>;

  const c = data.currency || "EUR";

  return (
    <div className="panel">
      <div className="top-row">
        <h2>Monthly Summary</h2>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <div className="stats">
        <StatCard label="Monthly Target" value={`${data.monthlyTarget.toFixed(2)} ${c}`} />
        <StatCard label="Earned So Far" value={`${data.earned.toFixed(2)} ${c}`} />
        <StatCard label="Expenses" value={`${data.expenses.toFixed(2)} ${c}`} />
        <StatCard label="After Expenses" value={`${data.afterExpenses.toFixed(2)} ${c}`} />
        <StatCard label="Worked Hours" value={data.workedHours.toFixed(2)} />
        <StatCard label="Reports" value={data.reportCount} />
      </div>
    </div>
  );
}