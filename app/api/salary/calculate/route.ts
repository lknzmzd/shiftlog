import { NextResponse } from "next/server";
import { calculateSalary } from "@/lib/salary";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = calculateSalary(body);

    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid salary request" },
      { status: 400 }
    );
  }
}