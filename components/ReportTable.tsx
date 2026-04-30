"use client";

import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";
import { Report } from "@/lib/types";

export default function ReportTable() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetch("/api/reports/list")
      .then((res) => res.json())
      .then((data) => setReports(data.data || []));
  }, []);

  return (
    <div className="panel">
      <h2>Saved Reports</h2>

      {reports.length === 0 && <p className="muted">No reports yet.</p>}

      <div className="report-list">
        {reports.map((report) => (
          <div key={report.id} className="report-card">
            <p className="muted small">
              {new Date(report.created_at).toLocaleString()}
            </p>
            <pre>{report.final_text}</pre>
            <CopyButton text={report.final_text} />
          </div>
        ))}
      </div>
    </div>
  );
}