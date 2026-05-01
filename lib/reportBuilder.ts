export function buildReport(
  template: string,
  data: Record<string, string | number | null | undefined>
) {
  let result = template || "";

  Object.entries(data).forEach(([key, value]) => {
    const safeValue = value === null || value === undefined ? "" : String(value);

    result = result.replaceAll(`{{${key}}}`, safeValue);
  });

  return result.trim();
}