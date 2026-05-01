"use client";

import { useMemo, useState } from "react";
import WarehouseTemplatePicker from "./WarehouseTemplatePicker";

type Row = Record<string, any>;

type RawValidation = {
  warnings: { line: number; msg: string }[];
  errors: { line: number; msg: string }[];
};

function todaySlash() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "/");
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function parseTimeToMinutes(t: string) {
  const m = String(t || "").trim().match(/^(\d{1,2})\s*:\s*(\d{2})$/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh > 23 || mm > 59) return null;
  return hh * 60 + mm;
}

function minutesToHHMM(total: number) {
  const safe = ((total % 1440) + 1440) % 1440;
  return `${pad2(Math.floor(safe / 60))}:${pad2(safe % 60)}`;
}

function abnormalFmt(mins: number) {
  const safe = Math.max(0, Math.min(59, Math.round(Number(mins) || 0)));
  return `00:${pad2(safe)}`;
}

function cleanCell(value: any) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function rowsToTSV(rows: Row[], date: string) {
  return rows
    .map((r) =>
      [
        date,
        r.deviceType || "",
        "",
        r.deviceNo || "",
        r.issueType || "",
        r.quick || "",
        r.subType || "",
        cleanCell(r.issueDesc),
        cleanCell(r.recovery),
        r.status || "",
        r.discoverer || "@",
        r.startTime || "",
        r.endTime || "",
        r.abnormal || "",
      ].join("\t")
    )
    .join("\n");
}

function recalcRow(row: Row) {
  const minutes = Math.max(0, Number(row.minutes) || 2);
  const startMin = parseTimeToMinutes(row.startTime || "");
  const endTime = startMin == null ? "" : minutesToHHMM(startMin + minutes);
  const abnormal = abnormalFmt(minutes);

  return {
    ...row,
    minutes,
    endTime,
    abnormal,
    operatorSentence: [
      row.deviceNo ? `${row.deviceNo}.` : "",
      cleanCell(row.issueDesc),
      cleanCell(row.recovery),
      row.startTime || "",
    ]
      .filter(Boolean)
      .join(" "),
  };
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/tab-separated-values;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

const EXAMPLE = `Ilkin
698. Unable to drive. Dirty DM code 09:15
1301. Charging failure. Parameter configuration error 10:20
H101. Failed to take a case. Wrong box position 11:30`;

export default function WarehouseParser() {
  const [date, setDate] = useState(todaySlash());
  const [fallbackDeviceType, setFallbackDeviceType] = useState("K50H");
  const [defaultStatus, setDefaultStatus] = useState("已处理Processed");
  const [tempMeasures, setTempMeasures] = useState("Recovery.");
  const [defaultMin, setDefaultMin] = useState(2);
  const [rawText, setRawText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [outText, setOutText] = useState("");
  const [rawValidation, setRawValidation] = useState<RawValidation>({ warnings: [], errors: [] });
  const [stats, setStats] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const selectedRow = rows.find((r, i) => (r.rowKey || String(i)) === selectedRowKey) || null;

  const advanced = useMemo(() => {
    const top = (key: string) => {
      const map = new Map<string, number>();
      rows.forEach((r) => {
        const v = cleanCell(r[key] || "Unknown");
        map.set(v, (map.get(v) || 0) + 1);
      });
      return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    };

    return {
      deviceNos: top("deviceNo"),
      issueTypes: top("issueType"),
      quick: top("quick"),
      rules: top("ruleLabel"),
    };
  }, [rows]);

  function updateRows(nextRows: Row[]) {
    const fixed = nextRows.map(recalcRow);
    setRows(fixed);
    setOutText(rowsToTSV(fixed, date));
  }

  async function preview() {
    setStatus("Parsing...");

    const res = await fetch("/api/warehouse/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rawText,
        date,
        fallbackDeviceType,
        status: defaultStatus,
        tempMeasuresDefault: tempMeasures,
        defaultMin,
      }),
    });

    const json = await res.json();

    if (!json.success) {
      setStatus(json.error || "Parse failed");
      return;
    }

    const parsedRows = (json.data.rows || []).map(recalcRow);
    setRows(parsedRows);
    setOutText(json.data.tsv || rowsToTSV(parsedRows, date));
    setRawValidation(json.data.rawValidation || { warnings: [], errors: [] });
    setStats(json.data.stats || null);
    setSelectedRowKey(parsedRows[0]?.rowKey || null);
    setStatus(`Preview ready: ${parsedRows.length} row(s)`);
  }

  function generateTSV() {
    const tsv = rowsToTSV(rows, date);
    setOutText(tsv);
    setStatus(`Generated ${rows.length} TSV row(s)`);
  }

  async function copyTSV() {
    await navigator.clipboard.writeText(outText);
    setStatus("TSV copied");
  }

  function clearAll() {
    setRawText("");
    setRows([]);
    setOutText("");
    setRawValidation({ warnings: [], errors: [] });
    setStats(null);
    setSelectedRowKey(null);
    setStatus("Cleared");
  }

  function updateRow(index: number, patch: Row) {
    const next = rows.map((r, i) => (i === index ? recalcRow({ ...r, ...patch }) : r));
    updateRows(next);
  }

  function applyTemplate(template: any) {
    if (!selectedRow) return;
    const index = rows.indexOf(selectedRow);
    updateRow(index, {
      issueType: template.issueType,
      quick: template.quick,
      subType: template.subType,
      issueDesc: template.issueDesc,
      recovery: template.recovery,
      minutes: template.minutes,
      confidence: "manual-template",
      ruleLabel: template.label,
      warnings: (selectedRow.warnings || []).filter((w: string) => w !== "Not matched classification"),
    });
    setStatus(`Applied template: ${template.label}`);
  }

  async function saveLocalHistory() {
    const item = {
      id: crypto.randomUUID(),
      date,
      rawText,
      outText,
      rows,
      stats,
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("shiftlog_warehouse_history") || "[]");
    localStorage.setItem("shiftlog_warehouse_history", JSON.stringify([item, ...existing].slice(0, 50)));
    setStatus("Saved to browser history");
  }

  const validationErrorCount = rawValidation.errors.length;
  const validationWarnCount = rawValidation.warnings.length;

  return (
    <div className="warehouse-legacy">
      <header className="warehouse-header">
        <div>
          <h1>TK Service · Warehouse Incident Analysis Tool</h1>
          <p>
            Paste raw robot incident logs, review classifications, edit rows, and export Feishu-ready TSV.
          </p>
        </div>
        <div className="warehouse-status-row">
          <span className={`warehouse-dot ${rows.length ? "ok" : ""}`} />
          <span>Rows: <b>{rows.length}</b></span>
          <span>Warnings: <b>{stats?.warnings ?? 0}</b></span>
          <span>Errors: <b>{stats?.errors ?? 0}</b></span>
        </div>
      </header>

      <div className="warehouse-grid-three">
        <section className="warehouse-card warehouse-card-tall">
          <h2>1) Raw input + review</h2>
          <div className="warehouse-card-body">
            <div className="warehouse-row">
              <label>
                <span>Date</span>
                <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="YYYY/MM/DD" />
              </label>
              <label>
                <span>Default Device Type</span>
                <input value={fallbackDeviceType} onChange={(e) => setFallbackDeviceType(e.target.value)} />
              </label>
              <label>
                <span>Default Status</span>
                <input value={defaultStatus} onChange={(e) => setDefaultStatus(e.target.value)} />
              </label>
              <label>
                <span>Default Temporary measures</span>
                <input value={tempMeasures} onChange={(e) => setTempMeasures(e.target.value)} />
              </label>
            </div>

            <textarea
              className="warehouse-textarea"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste raw log here..."
            />

            <div className="warehouse-btns">
              <button className="btn" type="button" onClick={preview}>Preview / Review</button>
              <button className="btn" type="button" onClick={generateTSV} disabled={!rows.length}>Generate TSV</button>
              <button className="btn secondary" type="button" onClick={clearAll}>Clear</button>
              <button className="btn secondary" type="button" onClick={() => setRawText(EXAMPLE)}>Load example</button>
              <button className="btn secondary" type="button" onClick={saveLocalHistory} disabled={!rows.length}>Save history</button>
            </div>

            {status && <p className="warehouse-muted">{status}</p>}

            {(validationErrorCount > 0 || validationWarnCount > 0) && (
              <div className={`warehouse-issue-box ${validationErrorCount ? "error" : "warn"}`}>
                <b>Validation summary</b>
                <div>Errors: {validationErrorCount} · Warnings: {validationWarnCount}</div>
                {[...rawValidation.errors.slice(0, 4), ...rawValidation.warnings.slice(0, 4)].map((x, i) => (
                  <div key={`${x.line}-${x.msg}-${i}`}>Line {x.line}: {x.msg}</div>
                ))}
              </div>
            )}

            <div className="warehouse-review">
              <div className="warehouse-review-head">
                <b>Review & validation</b>
                <span>{rows.length} item(s)</span>
              </div>

              <div className="warehouse-review-list">
                {rows.length === 0 && <p className="warehouse-muted">No preview rows yet.</p>}

                {rows.map((row, index) => {
                  const key = row.rowKey || String(index);
                  const active = key === selectedRowKey;

                  return (
                    <button
                      key={key}
                      type="button"
                      className={`warehouse-review-item ${active ? "active" : ""}`}
                      onClick={() => setSelectedRowKey(key)}
                    >
                      <strong>{row.deviceNo || "UNKNOWN"}</strong>
                      <span>{row.issueDesc}</span>
                      <small>
                        {row.confidence || "—"} · {row.ruleLabel || "—"}
                      </small>
                      {!!row.warnings?.length && <em>{row.warnings.join(", ")}</em>}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedRow && (
              <div className="warehouse-edit-panel">
                <div className="warehouse-review-head">
                  <b>Edit preview row</b>
                  <span>{selectedRow.deviceNo || "UNKNOWN"}</span>
                </div>

                {(() => {
                  const index = rows.indexOf(selectedRow);
                  return (
                    <>
                      <div className="warehouse-row">
                        <label><span>Device Type</span><input value={selectedRow.deviceType || ""} onChange={(e) => updateRow(index, { deviceType: e.target.value })} /></label>
                        <label><span>Device No</span><input value={selectedRow.deviceNo || ""} onChange={(e) => updateRow(index, { deviceNo: e.target.value })} /></label>
                        <label><span>Minutes</span><input type="number" value={selectedRow.minutes || 0} onChange={(e) => updateRow(index, { minutes: Number(e.target.value) })} /></label>
                        <label><span>Start Time</span><input value={selectedRow.startTime || ""} onChange={(e) => updateRow(index, { startTime: e.target.value })} /></label>
                      </div>
                      <div className="warehouse-row">
                        <label><span>Issue Type</span><input value={selectedRow.issueType || ""} onChange={(e) => updateRow(index, { issueType: e.target.value })} /></label>
                        <label><span>Quick Class</span><input value={selectedRow.quick || ""} onChange={(e) => updateRow(index, { quick: e.target.value })} /></label>
                        <label><span>Subtype</span><input value={selectedRow.subType || ""} onChange={(e) => updateRow(index, { subType: e.target.value })} /></label>
                        <label><span>Confidence</span><input value={selectedRow.confidence || ""} onChange={(e) => updateRow(index, { confidence: e.target.value })} /></label>
                      </div>
                      <div className="warehouse-row">
                        <label className="wide"><span>Issue Description</span><input value={selectedRow.issueDesc || ""} onChange={(e) => updateRow(index, { issueDesc: e.target.value })} /></label>
                        <label className="wide"><span>Recovery</span><input value={selectedRow.recovery || ""} onChange={(e) => updateRow(index, { recovery: e.target.value })} /></label>
                      </div>

                      <div className="warehouse-operator-box">
                        <div><b>Raw line:</b> {selectedRow.rawLine}</div>
                        <div><b>Rule label:</b> {selectedRow.ruleLabel}</div>
                        <div><b>Matched keywords:</b> {(selectedRow.matchedKeywords || []).join(", ") || "—"}</div>
                        <div><b>Operator-ready sentence:</b> {selectedRow.operatorSentence}</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </section>

        <section className="warehouse-card">
          <h2>2) Output (TSV)</h2>
          <div className="warehouse-card-body">
            <div className="warehouse-row">
              <label>
                <span>Default minutes if unknown</span>
                <input type="number" value={defaultMin} onChange={(e) => setDefaultMin(Number(e.target.value))} />
              </label>
            </div>

            <textarea
              className="warehouse-textarea warehouse-output"
              value={outText}
              onChange={(e) => setOutText(e.target.value)}
              placeholder="TSV will appear here..."
            />

            <div className="warehouse-btns">
              <button className="btn" type="button" onClick={copyTSV} disabled={!outText}>Copy TSV</button>
              <button
                className="btn secondary"
                type="button"
                onClick={() => downloadText(`issue_list_${date.replaceAll("/", "-")}.tsv`, outText)}
                disabled={!outText}
              >
                Download .tsv
              </button>
            </div>

            <p className="warehouse-muted">Abnormal time format: 00:06. End time = Start + minutes.</p>

            <WarehouseTemplatePicker rawText={`${rawText}\n${selectedRow?.rawLine || ""}\n${selectedRow?.issueDesc || ""}`} onApply={applyTemplate} />
          </div>
        </section>

        <section className="warehouse-card">
          <h2>3) Advanced information</h2>
          <div className="warehouse-card-body">
            <div className="warehouse-stats-grid">
              <div><span>Total rows</span><b>{stats?.total ?? rows.length}</b></div>
              <div><span>High confidence</span><b>{stats?.highConfidence ?? 0}</b></div>
              <div><span>Not matched</span><b>{stats?.notMatched ?? 0}</b></div>
              <div><span>Duplicates</span><b>{stats?.duplicates ?? 0}</b></div>
            </div>

            <AdvancedList title="Top device numbers" items={advanced.deviceNos} />
            <AdvancedList title="Issue types" items={advanced.issueTypes} />
            <AdvancedList title="Quick classes" items={advanced.quick} />
            <AdvancedList title="Rules" items={advanced.rules} />
          </div>
        </section>
      </div>
    </div>
  );
}

function AdvancedList({ title, items }: { title: string; items: [string, number][] }) {
  return (
    <div className="warehouse-advanced-list">
      <h3>{title}</h3>
      {items.length === 0 && <p className="warehouse-muted">No data.</p>}
      {items.map(([label, count]) => (
        <div key={label}>
          <span>{label}</span>
          <b>{count}</b>
        </div>
      ))}
    </div>
  );
}
