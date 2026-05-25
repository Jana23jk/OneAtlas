import { NextResponse } from "next/server";
import { getHealthStatus } from "@/services/health.service";

export async function GET(): Promise<
  NextResponse<Awaited<ReturnType<typeof getHealthStatus>>>
> {
  const response = getHealthStatus();
  return NextResponse.json(response);
}
