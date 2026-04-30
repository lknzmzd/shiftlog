import { NextResponse } from "next/server";
import { calculateSalary } from "@/lib/salary";

export async function POST(req: Request) {
  const body = await req.json();
  const result = calculateSalary(body);

  return NextResponse.json({ success: true, result });
}