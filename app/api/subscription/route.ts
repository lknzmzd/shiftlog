import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireUser } from "@/lib/supabaseServer";

export async function GET() {
  const { user, error: authError } = await requireUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: authError },
      { status: 401 }
    );
  }

  let { data, error } = await supabaseAdmin
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    const created = await supabaseAdmin
      .from("user_subscriptions")
      .insert({
        user_id: user.id,
        plan: "free",
        reports_limit: 10,
        reports_used: 0,
      })
      .select()
      .single();

    data = created.data;

    if (created.error) {
      return NextResponse.json(
        { success: false, error: created.error.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true, data });
}