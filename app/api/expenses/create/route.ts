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
    .from("expense_items")
    .insert({
      user_id: user.id,
      title: body.title,
      amount: body.amount,
      expense_month: body.expenseMonth,
      workplace_id: body.workplaceId || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error }, { status: 500 });

  return NextResponse.json({ success: true, data });
}