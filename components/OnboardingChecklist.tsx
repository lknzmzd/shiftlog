"use client";

const items = [
  "Create your account",
  "Save salary profile",
  "Add your first work day",
  "Add fixed expenses",
  "Create your first report",
  "Export your report history",
];

export default function OnboardingChecklist() {
  return (
    <div className="panel">
      <h2>Setup Checklist</h2>

      <div className="report-list">
        {items.map((item, index) => (
          <div key={item} className="report-card">
            <strong>{index + 1}. {item}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}