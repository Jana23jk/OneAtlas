import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";
import type { MutationLogEntry } from "@/types/app";
import { prisma } from "@/lib/prisma";

// ─── GET /api/apps/[id]/history ──────────────────────────────────────────────
// Returns all MutationLog entries for an app, ordered oldest-first.
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ mutations: MutationLogEntry[] }>>> {
  const { id } = await params;

  // 1. Verify app exists — 404 if not
  let appExists: boolean;
  try {
    const app = await prisma.app.findUnique({
      where: { id },
      select: { id: true },
    });
    appExists = app !== null;
  } catch (error) {
    console.error("[GET /api/apps/[id]/history] DB findUnique App error:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }

  if (!appExists) {
    return NextResponse.json(
      {
        data: null,
        error: { code: "NOT_FOUND", message: `App "${id}" not found` },
      },
      { status: 404 }
    );
  }

  // 2. Fetch all mutation logs ordered oldest → newest
  let logs: Awaited<ReturnType<typeof prisma.mutationLog.findMany>>;
  try {
    logs = await prisma.mutationLog.findMany({
      where: { appId: id },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("[GET /api/apps/[id]/history] DB findMany MutationLog error:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }

  // 3. Map Prisma records → MutationLogEntry domain type
  const mutations: MutationLogEntry[] = logs.map((log) => ({
    id: log.id,
    instruction: log.instruction,
    mutationType: log.mutationType,
    resultSummary: log.resultSummary,
    success: log.success,
    schemaVersionAfter: log.schemaVersionAfter,
    createdAt: log.createdAt.toISOString(),
  }));

  return NextResponse.json(
    { data: { mutations }, meta: { total: mutations.length } },
    { status: 200 }
  );
}
