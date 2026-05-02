import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireUser } from "@/lib/supabaseServer";
import { buildReport } from "@/lib/reportBuilder";

function nullableUuid(value: unknown) {
  if (!value) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

export async function POST(req: Request) {
  const { user, error: authError } = await requireUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: authError || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const finalText = buildReport(body.templateText, {
      deviceNo: body.deviceNo || "",
      issueType: body.issueType || "",
      note: body.note || "",
      photoUrl: body.photoUrl || "",
    });

    if (!finalText) {
      return NextResponse.json(
        { success: false, error: "Report text is empty." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.rpc("create_report_with_quota", {
      p_user_id: user.id,
      p_workplace_id: nullableUuid(body.workplaceId),
      p_template_id: nullableUuid(body.templateId),
      p_device_no: body.deviceNo || null,
      p_issue_type: body.issueType || null,
      p_note: body.note || null,
      p_photo_url: body.photoUrl || null,
      p_final_text: finalText,
    });

    if (error) {
      const message = error.message || "Could not create report.";
      const status = message.toLowerCase().includes("limit reached") ? 403 : 500;

      return NextResponse.json(
        { success: false, error: message },
        { status }
      );
    }

    return NextResponse.json({ success: true, data, report: data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Invalid report request" },
      { status: 400 }
    );
  }
}
