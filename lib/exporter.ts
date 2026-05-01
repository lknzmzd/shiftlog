import { ParsedIncident } from "./types";

export function incidentsToTSV(rows: ParsedIncident[]) {
  const headers = [
    "Device Type",
    "Device No",
    "Issue Type",
    "Quick Reason",
    "Issue Text",
    "Shift",
    "Created By",
  ];

  const body = rows.map((row) =>
    [
      row.deviceType,
      row.deviceNo,
      row.issueType,
      row.quickReason,
      row.issueText,
      row.shift,
      row.createdBy,
    ].join("\t")
  );

  return [headers.join("\t"), ...body].join("\n");
}