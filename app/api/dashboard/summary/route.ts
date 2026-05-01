import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data: profile } = await supabaseAdmin
    .from("salary_profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: days } = await supabaseAdmin
    .from("work_days")
    .select("*");

  const { data: reports } = await supabaseAdmin
    .from("reports")
    .select("*");

  const workedHours =
    days?.reduce((sum, d) => sum + Number(d.hours_worked || 0), 0) || 0;

  const hourlyRate = Number(profile?.hourly_rate || 0);
  const monthlyTarget =
    Number(profile?.hourly_rate || 0) *
    Number(profile?.hours_per_day || 0) *
    Number(profile?.working_days_per_month || 0);

  const earned = workedHours * hourlyRate;
  const expenses = Number(profile?.fixed_expenses || 0);

  return NextResponse.json({
    success: true,
    data: {
      monthlyTarget,
      workedHours,
      earned,
      expenses,
      afterExpenses: earned - expenses,
      reportCount: reports?.length || 0,
      workDayCount: days?.length || 0,
      currency: profile?.currency || "EUR",
    },
  });
}