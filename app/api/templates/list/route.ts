import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireUser } from "@/lib/supabaseServer";

export async function GET() {
  const { user, error: authError } = await requireUser();

  if (!user) {
    return NextResponse.json({ success: false, error: authError }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("report_templates")
    .select("*")
    .or(`user_id.eq.${user.id},user_id.is.null`)
    .order("usage_count", { ascending: false });

  if (error) return NextResponse.json({ success: false, error }, { status: 500 });

  return NextResponse.json({ success: true, data });
}