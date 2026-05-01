import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireUser } from "@/lib/supabaseServer";

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export async function GET(req: Request) {
  const { user, error: authError } = await requireUser();

  if (!user) {
    return NextResponse.json({ success: false, error: authError }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") || getCurrentMonth();

  const monthStart = `${month}-01`;
  const monthEnd = new Date(
    Number(month.slice(0, 4)),
    Number(month.slice(5, 7)),
    0
  )
    .toISOString()
    .slice(0, 10);

  const { data: profile } = await supabaseAdmin
    .from("salary_profiles")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: days } = await supabaseAdmin
    .from("work_days")
    .select("*")
    .eq("user_id", user.id)
    .gte("work_date", monthStart)
    .lte("work_date", monthEnd);

  const { data: expenses } = await supabaseAdmin
    .from("expense_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("expense_month", month);

  const { data: reports } = await supabaseAdmin
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", `${monthStart}T00:00:00`)
    .lte("created_at", `${monthEnd}T23:59:59`);

  const workedHours =
    days?.reduce((sum, d) => sum + Number(d.hours_worked || 0), 0) || 0;

  const hourlyRate = Number(profile?.hourly_rate || 0);

  const monthlyTarget =
    Number(profile?.hourly_rate || 0) *
    Number(profile?.hours_per_day || 0) *
    Number(profile?.working_days_per_month || 0);

  const earned = workedHours * hourlyRate;

  const expensesTotal =
    expenses?.reduce((sum, e) => sum + Number(e.amount || 0), 0) || 0;

  return NextResponse.json({
    success: true,
    data: {
      month,
      monthlyTarget,
      workedHours,
      earned,
      expenses: expensesTotal,
      afterExpenses: earned - expensesTotal,
      reportCount: reports?.length || 0,
      workDayCount: days?.length || 0,
      currency: profile?.currency || "EUR",
    },
  });
}