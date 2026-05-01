import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { parseIncident } from "@/lib/parser";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = parseIncident(body);

    const { data, error } = await supabaseAdmin
      .from("incidents")
      .insert({
        device_no: parsed.deviceNo,
        device_type: parsed.deviceType,
        issue_text: parsed.issueText,
        issue_type: parsed.issueType,
        quick_reason: parsed.quickReason,
        shift: parsed.shift,
        created_by: parsed.createdBy,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true, incident: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}