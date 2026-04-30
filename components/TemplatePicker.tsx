"use client";

import { useEffect, useState } from "react";
import { ReportTemplate } from "@/lib/types";

export default function TemplatePicker({
  onSelect,
}: {
  onSelect: (template: ReportTemplate) => void;
}) {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/templates/list")
      .then((res) => res.json())
      .then((data) => setTemplates(data.data || []));
  }, []);

  const filtered = templates.filter((t) =>
    `${t.title} ${t.template_text}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="panel">
      <h2>Templates</h2>

      <input
        placeholder="Search template..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <p className="muted small">Top 3 most-used templates appear first.</p>

      <div className="template-list">
        {filtered.map((template) => (
          <button
            key={template.id}
            type="button"
            className="template-card"
            onClick={() => onSelect(template)}
          >
            <strong>{template.title}</strong>
            <span>Used {template.usage_count} times</span>
            <small>{template.template_text}</small>
          </button>
        ))}
      </div>
    </div>
  );
}