import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/equipment/queries";

export async function GET() {
  return NextResponse.json(await getDashboardData());
}
