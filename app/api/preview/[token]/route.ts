import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";
import type { AppSchema } from "@/types/app";
import { prisma } from "@/lib/prisma";
import { jsonToAppSchema } from "@/lib/schema-json";

// ─── Shared: resolve snapshot by token ───────────────────────────────────────

async function findSnapshot(token: string) {
  return prisma.previewSnapshot.findUnique({ where: { token } });
}

// ─── GET /api/preview/[token] ─────────────────────────────────────────────────
// Public — no auth required.
// Returns the frozen schema captured at snapshot creation time.
// Rejects revoked and expired previews with 410 Gone.
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
): Promise<NextResponse<ApiResponse<{ schema: AppSchema; expiresAt: string | null }>>> {
  const { token } = await params;

  let snapshot: Awaited<ReturnType<typeof findSnapshot>>;
  try {
    snapshot = await findSnapshot(token);
  } catch (error) {
    console.error("[GET /api/preview/[token]] DB findUnique error:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }

  // 404 — token doesn't exist
  if (!snapshot) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "PREVIEW_NOT_FOUND",
          message: `Preview token "${token}" does not exist`,
        },
      },
      { status: 404 }
    );
  }

  // 410 — explicitly revoked (soft-deleted)
  if (snapshot.revokedAt !== null) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "PREVIEW_REVOKED",
          message: "This preview link has been revoked and is no longer accessible.",
        },
      },
      { status: 410 }
    );
  }

  // 410 — TTL has elapsed
  if (snapshot.expiresAt !== null && snapshot.expiresAt < new Date()) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "PREVIEW_EXPIRED",
          message: "This preview link has expired. Please generate a new one.",
        },
      },
      { status: 410 }
    );
  }

  // Return the frozen schema — NOT the live RuntimeSchema
  const schema = jsonToAppSchema(snapshot.schema);

  return NextResponse.json(
    {
      data: {
        schema,
        expiresAt: snapshot.expiresAt ? snapshot.expiresAt.toISOString() : null,
      },
    },
    { status: 200 }
  );
}

// ─── DELETE /api/preview/[token] ──────────────────────────────────────────────
// Soft-delete: sets revokedAt to now so the GET route returns 410 from this
// point on. The snapshot row is retained for audit purposes.
// ─────────────────────────────────────────────────────────────────────────────

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
): Promise<NextResponse<ApiResponse<{ revoked: boolean }>>> {
  const { token } = await params;

  // 1. Confirm the snapshot exists before trying to revoke it
  let snapshot: Awaited<ReturnType<typeof findSnapshot>>;
  try {
    snapshot = await findSnapshot(token);
  } catch (error) {
    console.error("[DELETE /api/preview/[token]] DB findUnique error:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }

  if (!snapshot) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "PREVIEW_NOT_FOUND",
          message: `Preview token "${token}" does not exist`,
        },
      },
      { status: 404 }
    );
  }

  // 2. Soft-delete: stamp revokedAt
  try {
    await prisma.previewSnapshot.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
  } catch (error) {
    console.error("[DELETE /api/preview/[token]] DB update error:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { revoked: true } }, { status: 200 });
}
