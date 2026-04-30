"use client";

import { useState } from "react";
import TemplatePicker from "./TemplatePicker";
import CopyButton from "./CopyButton";
import { ReportTemplate } from "@/lib/types";

const defaultTemplate =
  "Device: {{deviceNo}}\nIssue: {{issueType}}\nNote: {{note}}\nPhoto: {{photoUrl}}";

export default function ReportBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [finalText, setFinalText] = useState("");
  const [status, setStatus] = useState("");

  async function generate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Generating...");

    const form = new FormData(e.currentTarget);

    const payload = {
      templateId: selectedTemplate?.id || null,
      templateText: selectedTemplate?.template_text || defaultTemplate,
      deviceNo: String(form.get("deviceNo") || ""),
      issueType: String(form.get("issueType") || ""),
      note: String(form.get("note") || ""),
      photoUrl: String(form.get("photoUrl") || ""),
    };

    const res = await fetch("/api/reports/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      setStatus("Failed");
      return;
    }

    setFinalText(data.report.final_text);
    setStatus("Saved");
  }

  return (
    <section className="grid-section">
      <div>
        <TemplatePicker onSelect={(template) => setSelectedTemplate(template)} />

        {selectedTemplate && (
          <div className="notice">
            Selected template: <strong>{selectedTemplate.title}</strong>
          </div>
        )}
      </div>

      <form onSubmit={generate} className="panel">
        <h2>Build Report</h2>

        <input name="deviceNo" placeholder="Device / object / task name" />
        <input name="issueType" placeholder="Issue / task type" />
        <input name="photoUrl" placeholder="Photo URL or photo note" />
        <textarea name="note" placeholder="Write note..." required />

        <button className="btn" type="submit">Generate + Save</button>

        {status && <p className="muted">{status}</p>}

        {finalText && (
          <div className="result">
            <pre>{finalText}</pre>
            <CopyButton text={finalText} />
          </div>
        )}
      </form>
    </section>
  );
}