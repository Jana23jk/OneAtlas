import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";
import type { AppSchema } from "@/types/app";
import { prisma } from "@/lib/prisma";
import { jsonToAppSchema, appSchemaToJson } from "@/lib/schema-json";

// ─── POST /api/apps/[id]/undo ─────────────────────────────────────────────────
// Rolls the app back to the previous schema version.
//   - 400 NOTHING_TO_UNDO if already at v1
//   - Deletes the current SchemaVersion snapshot (clean undo)
//   - Writes a MutationLog entry for the undo action
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ schema: AppSchema; versionAfter: number }>>> {
  const { id } = await params;

  // 1. Fetch the app to get its current version
  let app: { id: string; currentSchemaVersion: number } | null = null;
  try {
    app = await prisma.app.findUnique({
      where: { id },
      select: { id: true, currentSchemaVersion: true },
    });
  } catch (error) {
    console.error("[POST /api/apps/[id]/undo] DB findUnique App error:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }

  if (!app) {
    return NextResponse.json(
      {
        data: null,
        error: { code: "NOT_FOUND", message: `App "${id}" not found` },
      },
      { status: 404 }
    );
  }

  // 2. Guard: can't undo from version 1 (the initial generated state)
  if (app.currentSchemaVersion <= 1) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "NOTHING_TO_UNDO",
          message: "Already at the initial version — there is nothing to undo.",
        },
      },
      { status: 400 }
    );
  }

  const currentVersion = app.currentSchemaVersion;
  const previousVersion = currentVersion - 1;

  // 3. Fetch the previous SchemaVersion snapshot
  let previousSnapshot: Awaited<ReturnType<typeof prisma.schemaVersion.findUnique>>;
  try {
    previousSnapshot = await prisma.schemaVersion.findUnique({
      where: { appId_version: { appId: id, version: previousVersion } },
    });
  } catch (error) {
    console.error("[POST /api/apps/[id]/undo] DB findUnique SchemaVersion error:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }

  if (!previousSnapshot) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "NOT_FOUND",
          message: `Schema version ${previousVersion} not found for app "${id}"`,
        },
      },
      { status: 404 }
    );
  }

  const restoredSchema = jsonToAppSchema(previousSnapshot.schema);
  const restoredSchemaJson = appSchemaToJson(restoredSchema);

  // 4. Prisma transaction: restore schema, clean up current version, log the undo
  try {
    await prisma.$transaction(async (tx) => {
      // 4a. Restore RuntimeSchema to the previous version's schema
      await tx.runtimeSchema.update({
        where: { appId: id },
        data: {
          schema: restoredSchemaJson,
          version: previousVersion,
        },
      });

      // 4b. Decrement App.currentSchemaVersion
      await tx.app.update({
        where: { id },
        data: { currentSchemaVersion: previousVersion },
      });

      // 4c. Hard-delete the now-abandoned current SchemaVersion snapshot
      await tx.schemaVersion.delete({
        where: { appId_version: { appId: id, version: currentVersion } },
      });

      // 4d. Audit log entry for the undo action
      await tx.mutationLog.create({
        data: {
          appId: id,
          instruction: "Undo last change",
          mutationType: "undo",
          payload: {
            revertedFromVersion: currentVersion,
            revertedToVersion: previousVersion,
          },
          resultSummary: `Reverted from schema v${currentVersion} to v${previousVersion}`,
          success: true,
          schemaVersionAfter: previousVersion,
        },
      });
    });
  } catch (error) {
    console.error("[POST /api/apps/[id]/undo] DB transaction error:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      data: {
        schema: restoredSchema,
        versionAfter: previousVersion,
      },
    },
    { status: 200 }
  );
}
