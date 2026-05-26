import { NextResponse } from "next/server";
import { z } from "zod";
import type { ApiResponse, EditResponse } from "@/types/api";
import type { AppSchema, SchemaMutation } from "@/types/app";
import { prisma } from "@/lib/prisma";
import { appSchemaToJson, jsonToAppSchema } from "@/lib/schema-json";
import { applyMutation, describeMutation } from "@/services/mutationService";
import {
  parseInstruction,
  suggestInstruction,
} from "@/services/instructionParser";

// ─── Validation schema ────────────────────────────────────────────────────────

const editSchema = z.object({
  instruction: z.string().min(1).max(1000),
});

// ─── Sentinel resolver ────────────────────────────────────────────────────────

/**
 * The instructionParser returns mutations with sentinel component/field IDs
 * such as "__first__", "__name:fieldName__", and "__move_to_top:componentName__".
 * This function resolves them to real IDs using the live schema before the
 * mutation is passed to applyMutation().
 */
function resolveSentinels(
  mutation: SchemaMutation,
  schema: AppSchema
): SchemaMutation {
  const firstComponent = [...schema.components].sort((a, b) => a.order - b.order)[0];

  if (!firstComponent) {
    throw new Error("Schema has no components to mutate");
  }

  switch (mutation.type) {
    case "add_field": {
      if (mutation.componentId !== "__first__") return mutation;
      return { ...mutation, componentId: firstComponent.id };
    }

    case "remove_field": {
      const componentId =
        mutation.componentId === "__first__"
          ? firstComponent.id
          : mutation.componentId;

      // Resolve field sentinel __name:xxx__
      const nameMatch = mutation.fieldId.match(/^__name:(.+)__$/);
      if (nameMatch) {
        const component = schema.components.find((c) => c.id === componentId);
        if (!component) {
          throw new Error(`Component ${componentId} not found`);
        }
        const fieldName = nameMatch[1];
        const field = component.fields.find(
          (f) => f.name.toLowerCase() === fieldName.toLowerCase()
        );
        if (!field) {
          throw new Error(
            `Field named "${fieldName}" not found in component "${component.name}"`
          );
        }
        return { ...mutation, componentId, fieldId: field.id };
      }
      return { ...mutation, componentId };
    }

    case "rename_field": {
      const componentId =
        mutation.componentId === "__first__"
          ? firstComponent.id
          : mutation.componentId;

      const nameMatch = mutation.fieldId.match(/^__name:(.+)__$/);
      if (nameMatch) {
        const component = schema.components.find((c) => c.id === componentId);
        if (!component) {
          throw new Error(`Component ${componentId} not found`);
        }
        const fieldName = nameMatch[1];
        const field = component.fields.find(
          (f) => f.name.toLowerCase() === fieldName.toLowerCase()
        );
        if (!field) {
          throw new Error(
            `Field named "${fieldName}" not found in component "${component.name}"`
          );
        }
        return { ...mutation, componentId, fieldId: field.id };
      }
      return { ...mutation, componentId };
    }

    case "reorder_components": {
      const sentinel = mutation.orderedComponentIds[0] ?? "";
      const moveMatch = sentinel.match(/^__move_to_top:(.+)__$/);
      if (!moveMatch) return mutation;

      const targetName = moveMatch[1].trim().toLowerCase();
      const target = schema.components.find(
        (c) => c.name.toLowerCase() === targetName
      );
      if (!target) {
        throw new Error(
          `Component named "${moveMatch[1]}" not found in schema`
        );
      }

      // Build full ordered list: target first, then all others sorted by current order
      const rest = schema.components
        .filter((c) => c.id !== target.id)
        .sort((a, b) => a.order - b.order)
        .map((c) => c.id);

      return { ...mutation, orderedComponentIds: [target.id, ...rest] };
    }

    default:
      return mutation;
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<EditResponse>>> {
  const { id } = await params;

  // 1. Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "Request body must be valid JSON",
        },
      },
      { status: 400 }
    );
  }

  const parsed = editSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: parsed.error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  const { instruction } = parsed.data;

  // 2. Fetch App — 404 if not found
  let app: Awaited<ReturnType<typeof prisma.app.findUnique>>;
  try {
    app = await prisma.app.findUnique({ where: { id } });
  } catch (error) {
    console.error("[POST /api/apps/[id]/edit] DB findUnique App error:", error);
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

  // 3. Fetch RuntimeSchema
  let runtimeRecord: Awaited<ReturnType<typeof prisma.runtimeSchema.findUnique>>;
  try {
    runtimeRecord = await prisma.runtimeSchema.findUnique({ where: { appId: id } });
  } catch (error) {
    console.error("[POST /api/apps/[id]/edit] DB findUnique RuntimeSchema error:", error);
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

  const currentSchema: AppSchema = jsonToAppSchema(runtimeRecord.schema);

  // 4. Parse natural-language instruction → SchemaMutation
  const rawMutation = parseInstruction(instruction);
  if (!rawMutation) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "UNRECOGNIZED_INSTRUCTION",
          message: suggestInstruction(instruction),
        },
      },
      { status: 400 }
    );
  }

  // 5. Resolve sentinel IDs against the live schema, then apply mutation
  let resolvedMutation: SchemaMutation;
  let updatedSchema: AppSchema;
  try {
    resolvedMutation = resolveSentinels(rawMutation, currentSchema);
    updatedSchema = applyMutation(currentSchema, resolvedMutation);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[POST /api/apps/[id]/edit] Mutation error:", error);
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "MUTATION_FAILED",
          message,
        },
      },
      { status: 422 }
    );
  }

  const resultSummary = describeMutation(resolvedMutation);
  const versionAfter = runtimeRecord.version + 1;
  const updatedSchemaJson = appSchemaToJson(updatedSchema);

  // 6. Persist in a single Prisma transaction
  try {
    await prisma.$transaction(async (tx) => {
      // 6a. Update RuntimeSchema (version bump)
      await tx.runtimeSchema.update({
        where: { appId: id },
        data: {
          schema: updatedSchemaJson,
          version: versionAfter,
        },
      });

      // 6b. Frozen snapshot of the new version
      await tx.schemaVersion.create({
        data: {
          appId: id,
          schema: updatedSchemaJson,
          version: versionAfter,
        },
      });

      // 6c. Reflect new version on App
      await tx.app.update({
        where: { id },
        data: { currentSchemaVersion: versionAfter },
      });

      // 6d. Mutation audit log
      await tx.mutationLog.create({
        data: {
          appId: id,
          instruction,
          mutationType: resolvedMutation.type,
          payload: resolvedMutation as unknown as object,
          resultSummary,
          success: true,
          schemaVersionAfter: versionAfter,
        },
      });
    });
  } catch (error) {
    console.error("[POST /api/apps/[id]/edit] DB transaction error:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }

  // 7. Return updated schema + mutation + version
  return NextResponse.json({
    data: {
      schema: updatedSchema,
      mutation: resolvedMutation,
      versionAfter,
      resultSummary,
    },
  });
}
