"use client";

import { useEffect, useState } from "react";
import StatCard from "./StatCard";

export default function DashboardSummary() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((res) => res.json())
      .then((json) => setData(json.data));
  }, []);

  if (!data) return <p className="muted">Loading dashboard...</p>;

  const c = data.currency || "EUR";

  return (
    <div className="stats">
      <StatCard label="Monthly Target" value={`${data.monthlyTarget.toFixed(2)} ${c}`} />
      <StatCard label="Earned So Far" value={`${data.earned.toFixed(2)} ${c}`} />
      <StatCard label="After Expenses" value={`${data.afterExpenses.toFixed(2)} ${c}`} />
      <StatCard label="Worked Hours" value={data.workedHours.toFixed(2)} />
      <StatCard label="Work Days" value={data.workDayCount} />
      <StatCard label="Reports" value={data.reportCount} />
    </div>
  );
}