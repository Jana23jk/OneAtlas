import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import type { ApiResponse, PreviewCreateResponse } from "@/types/api";
import { prisma } from "@/lib/prisma";
import { jsonToAppSchema, appSchemaToJson } from "@/lib/schema-json";

// ─── POST /api/apps/[id]/preview ─────────────────────────────────────────────
// Creates a shareable preview snapshot of the app's current live schema.
// The snapshot is frozen at creation time — edits after this point won't
// affect the preview URL until a new one is generated.
// ─────────────────────────────────────────────────────────────────────────────

const PREVIEW_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<PreviewCreateResponse>>> {
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
    console.error("[POST /api/apps/[id]/preview] DB findUnique App error:", error);
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

  // 2. Fetch the current live RuntimeSchema
  let runtimeRecord: Awaited<ReturnType<typeof prisma.runtimeSchema.findUnique>>;
  try {
    runtimeRecord = await prisma.runtimeSchema.findUnique({
      where: { appId: id },
    });
  } catch (error) {
    console.error("[POST /api/apps/[id]/preview] DB findUnique RuntimeSchema error:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }

  if (!runtimeRecord) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "NOT_FOUND",
          message: `RuntimeSchema for app "${id}" not found`,
        },
      },
      { status: 404 }
    );
  }

  // 3. Generate token + expiry, persist the frozen snapshot
  // Round-trip through domain type to get a safe InputJsonValue (not nullable)
  const frozenSchemaJson = appSchemaToJson(jsonToAppSchema(runtimeRecord.schema));
  const token = nanoid(12);
  const expiresAt = new Date(Date.now() + PREVIEW_TTL_MS);

  try {
    await prisma.previewSnapshot.create({
      data: {
        appId: id,
        token,
        schema: frozenSchemaJson, // frozen at this moment
        expiresAt,
      },
    });
  } catch (error) {
    console.error("[POST /api/apps/[id]/preview] DB create PreviewSnapshot error:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }

  // 4. Build the shareable URL using the env var (falls back to localhost in dev)
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const previewUrl = `${baseUrl}/preview/${token}`;

  return NextResponse.json(
    {
      data: {
        previewUrl,
        token,
        expiresAt: expiresAt.toISOString(),
      },
    },
    { status: 201 }
  );
}
