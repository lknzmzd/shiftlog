import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response("Export failed", { status: 500 });
  }

  const headers = [
    "Created At",
    "Device No",
    "Issue Type",
    "Note",
    "Photo URL",
    "Final Text",
  ];

  const rows = (data || []).map((r) =>
    [
      r.created_at,
      r.device_no || "",
      r.issue_type || "",
      r.note || "",
      r.photo_url || "",
      String(r.final_text || "").replace(/\n/g, " "),
    ].join("\t")
  );

  const tsv = [headers.join("\t"), ...rows].join("\n");

  return new Response(tsv, {
    headers: {
      "Content-Type": "text/tab-separated-values",
      "Content-Disposition": `attachment; filename="shiftlog-reports.tsv"`,
    },
  });
}