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
    .from("work_days")
    .insert({
      user_id: user.id,
      workplace_id: body.workplaceId || null,
      work_date: body.workDate,
      hours_worked: body.hoursWorked,
      note: body.note || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error }, { status: 500 });

  return NextResponse.json({ success: true, data });
}