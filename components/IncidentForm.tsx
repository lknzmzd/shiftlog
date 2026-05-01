"use client";

import { useState } from "react";

export default function IncidentForm() {
  const [deviceNo, setDeviceNo] = useState("");
  const [issueText, setIssueText] = useState("");
  const [shift, setShift] = useState("Day");
  const [createdBy, setCreatedBy] = useState("Ilkin");
  const [status, setStatus] = useState("");

  async function submitIncident() {
    setStatus("Saving...");

    const res = await fetch("/api/incidents/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deviceNo,
        issueText,
        shift,
        createdBy,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setStatus("Failed to save incident");
      return;
    }

    setDeviceNo("");
    setIssueText("");
    setStatus("Saved successfully");
  }

  return (
    <div className="rounded-xl border p-6 space-y-4">
      <h2 className="text-xl font-bold">Add Incident</h2>

      <input
        className="w-full border rounded-lg p-3"
        placeholder="Device No"
        value={deviceNo}
        onChange={(e) => setDeviceNo(e.target.value)}
      />

      <textarea
        className="w-full border rounded-lg p-3 min-h-32"
        placeholder="Paste incident text..."
        value={issueText}
        onChange={(e) => setIssueText(e.target.value)}
      />

      <select
        className="w-full border rounded-lg p-3"
        value={shift}
        onChange={(e) => setShift(e.target.value)}
      >
        <option>Day</option>
        <option>Night</option>
      </select>

      <input
        className="w-full border rounded-lg p-3"
        placeholder="Created By"
        value={createdBy}
        onChange={(e) => setCreatedBy(e.target.value)}
      />

      <button
        onClick={submitIncident}
        className="rounded-lg bg-black text-white px-5 py-3"
      >
        Save Incident
      </button>

      {status && <p className="text-sm">{status}</p>}
    </div>
  );
}