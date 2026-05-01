"use client";

import { TEMPLATE_SUGGESTIONS } from "@/lib/warehouse/templates";

type Props = {
  rawText: string;
  onApply: (template: any) => void;
};

export default function WarehouseTemplatePicker({ rawText, onApply }: Props) {
  const L = String(rawText || "").toLowerCase();
  const groups = TEMPLATE_SUGGESTIONS.filter((group: any) =>
    (group.triggerKeywords || []).some((kw: string) => L.includes(kw.toLowerCase()))
  );

  if (!groups.length) {
    return (
      <div className="warehouse-template-box">
        <h3>Suggested templates</h3>
        <p className="warehouse-muted">Templates appear when text matches known incident families.</p>
      </div>
    );
  }

  return (
    <div className="warehouse-template-box">
      <h3>Suggested templates</h3>
      <p className="warehouse-muted">Click template to apply it to selected preview row.</p>

      <div className="warehouse-template-list">
        {groups.flatMap((group: any) => group.items || []).slice(0, 12).map((item: any) => (
          <button
            key={item.id}
            type="button"
            className="warehouse-template-card"
            onClick={() => onApply(item)}
          >
            <strong>{item.label}</strong>
            <span>{item.issueDesc}</span>
            <small>{item.recovery}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
