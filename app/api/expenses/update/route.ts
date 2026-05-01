import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireUser } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { user, error: authError } = await requireUser();

  if (!user) {
    return NextResponse.json({ success: false, error: authError }, { status: 401 });
  }

  const body = await req.json();

  const { error } = await supabaseAdmin
    .from("expense_items")
    .update({
      amount: body.amount,
      title: body.title,
    })
    .eq("id", body.id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ success: false, error }, { status: 500 });

  return NextResponse.json({ success: true });
}