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
  request: Request,
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

  // 2. Fetch runtime schema version
  let runtimeSchema: Awaited<ReturnType<typeof prisma.runtimeSchema.findFirst>> = null;
  try {
    runtimeSchema = await prisma.runtimeSchema.findFirst({
      where: { appId: id },
      orderBy: { version: "desc" },
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

  if (!runtimeSchema) {
    return NextResponse.json(
      {
        data: null,
        error: { code: "NOT_FOUND", message: `No schema version found for app "${id}"` },
      },
      { status: 404 }
    );
  }

  // 3. Create frozen preview snapshot
  const token = nanoid(12);
  const expiresAt = new Date(Date.now() + PREVIEW_TTL_MS);
  const frozenSchemaJson = appSchemaToJson(jsonToAppSchema(runtimeSchema.schema));

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

  // 4. Build the shareable URL. We dynamically use the request's origin so that it automatically
  // matches the current domain (e.g. localhost, vercel preview deploy, or custom production domain).
  let reqOrigin = "";
  try {
    reqOrigin = new URL(request.url).origin;
  } catch (err) {
    console.warn("Could not parse request.url:", err);
  }

  const baseUrl =
    reqOrigin ||
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
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
