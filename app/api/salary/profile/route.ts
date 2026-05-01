import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireUser } from "@/lib/supabaseServer";

export async function GET() {
  const { user, error: authError } = await requireUser();

  if (!user) {
    return NextResponse.json({ success: false, error: authError }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("salary_profiles")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ success: false, error }, { status: 500 });

  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  const { user, error: authError } = await requireUser();

  if (!user) {
    return NextResponse.json({ success: false, error: authError }, { status: 401 });
  }

  const body = await req.json();

  await supabaseAdmin
    .from("salary_profiles")
    .update({ active: false })
    .eq("user_id", user.id);

  const { data, error } = await supabaseAdmin
    .from("salary_profiles")
    .insert({
      user_id: user.id,
      hourly_rate: body.hourlyRate,
      hours_per_day: body.hoursPerDay,
      working_days_per_month: body.workingDaysPerMonth,
      fixed_expenses: body.fixedExpenses,
      currency: body.currency || "EUR",
      active: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error }, { status: 500 });

  return NextResponse.json({ success: true, data });
}