import { classifyIncident } from "./classifier";
import { IncidentInput, ParsedIncident } from "./types";

function inferDeviceType(deviceNo?: string) {
  if (!deviceNo) return "Unknown";

  const d = deviceNo.toUpperCase();

  if (d.startsWith("K50")) return "K50H";
  if (d.startsWith("A42")) return "A42T-E2";

  return "Unknown";
}

export function parseIncident(input: IncidentInput): ParsedIncident {
  const classified = classifyIncident(input.issueText);

  return {
    deviceNo: input.deviceNo || "Unknown",
    deviceType: input.deviceType || inferDeviceType(input.deviceNo),
    issueText: input.issueText,
    issueType: classified.issueType,
    quickReason: classified.quickReason,
    shift: input.shift || "Unknown",
    createdBy: input.createdBy || "Unknown",
  };
}