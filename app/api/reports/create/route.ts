import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { buildReport } from "@/lib/reportBuilder";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const finalText = buildReport(body.templateText, {
      deviceNo: body.deviceNo || "",
      issueType: body.issueType || "",
      note: body.note || "",
      photoUrl: body.photoUrl || "",
    });

    const { data, error } = await supabaseAdmin
      .from("reports")
      .insert({
        workplace_id: body.workplaceId || null,
        template_id: body.templateId || null,
        device_no: body.deviceNo || null,
        issue_type: body.issueType || null,
        note: body.note || null,
        photo_url: body.photoUrl || null,
        final_text: finalText,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    if (body.templateId) {
      await supabaseAdmin.rpc("increment_template_usage", {
        template_uuid: body.templateId,
      });
    }

    return NextResponse.json({ success: true, report: data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid report request" },
      { status: 400 }
    );
  }
}