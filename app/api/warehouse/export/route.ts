import { previewRowsToTSV } from "@/lib/warehouse/exporter";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const date = String(body.date || new Date().toISOString().slice(0, 10).replaceAll("-", "/"));
    const tsv = previewRowsToTSV(rows, date).join("\n");

    return new Response(tsv, {
      headers: {
        "Content-Type": "text/tab-separated-values;charset=utf-8",
        "Content-Disposition": `attachment; filename="warehouse_${date.replaceAll("/", "-")}.tsv"`,
      },
    });
  } catch {
    return new Response("Export failed", { status: 500 });
  }
}
