import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("salary_profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ success: false, error }, { status: 500 });

  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("salary_profiles")
    .insert({
      hourly_rate: body.hourlyRate,
      hours_per_day: body.hoursPerDay,
      working_days_per_month: body.workingDaysPerMonth,
      fixed_expenses: body.fixedExpenses,
      currency: body.currency || "EUR",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error }, { status: 500 });

  return NextResponse.json({ success: true, data });
}