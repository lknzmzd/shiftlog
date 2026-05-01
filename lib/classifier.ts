export function classifyIncident(text: string) {
  const t = text.toLowerCase();

  if (t.includes("charge") || t.includes("charging")) {
    return {
      issueType: "Charging",
      quickReason: "Charging issue",
    };
  }

  if (t.includes("map") || t.includes("navigation")) {
    return {
      issueType: "Navigation",
      quickReason: "Navigation / map issue",
    };
  }

  if (t.includes("offline") || t.includes("disconnect")) {
    return {
      issueType: "Connection",
      quickReason: "Robot offline / disconnected",
    };
  }

  if (t.includes("stuck") || t.includes("blocked")) {
    return {
      issueType: "Movement",
      quickReason: "Robot stuck / blocked",
    };
  }

  return {
    issueType: "Other",
    quickReason: "Manual review needed",
  };
}