import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireUser } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { user, error: authError } = await requireUser();

  if (!user) {
    return NextResponse.json({ success: false, error: authError }, { status: 401 });
  }

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("report_templates")
    .insert({
      user_id: user.id,
      title: body.title,
      template_text: body.templateText,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error }, { status: 500 });

  return NextResponse.json({ success: true, data });
}