import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireUser } from "@/lib/supabaseServer";
import { buildReport } from "@/lib/reportBuilder";

export async function POST(req: Request) {
  const { user, error: authError } = await requireUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: authError },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    let { data: sub, error: subError } = await supabaseAdmin
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (subError) {
      return NextResponse.json(
        { success: false, error: subError.message },
        { status: 500 }
      );
    }

    if (!sub) {
      const { data: createdSub, error: createSubError } = await supabaseAdmin
        .from("user_subscriptions")
        .insert({
          user_id: user.id,
          plan: "free",
          reports_limit: 10,
          reports_used: 0,
        })
        .select()
        .single();

      if (createSubError) {
        return NextResponse.json(
          { success: false, error: createSubError.message },
          { status: 500 }
        );
      }

      sub = createdSub;
    }

    if (sub.plan === "free" && sub.reports_used >= sub.reports_limit) {
      return NextResponse.json(
        { success: false, error: "Limit reached. Upgrade to Pro." },
        { status: 403 }
      );
    }

    const finalText = buildReport(body.templateText, {
      deviceNo: body.deviceNo || "",
      issueType: body.issueType || "",
      note: body.note || "",
      photoUrl: body.photoUrl || "",
    });

    const { data, error } = await supabaseAdmin
      .from("reports")
      .insert({
        user_id: user.id,
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
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    await supabaseAdmin
      .from("user_subscriptions")
      .update({
        reports_used: Number(sub.reports_used || 0) + 1,
      })
      .eq("user_id", user.id);

    if (body.templateId) {
      await supabaseAdmin.rpc("increment_template_usage", {
        template_uuid: body.templateId,
      });
    }

    return NextResponse.json({ success: true, data, report: data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid report request" },
      { status: 400 }
    );
  }
}