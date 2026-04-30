import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("work_days")
      .insert({
        workplace_id: body.workplaceId || null,
        work_date: body.workDate,
        hours_worked: body.hoursWorked,
        note: body.note || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid work day request" },
      { status: 400 }
    );
  }
}