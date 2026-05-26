import { NextResponse } from "next/server";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import type { ApiResponse, GenerateResponse } from "@/types/api";
import type { AppSchema } from "@/types/app";
import { matchTemplate, suggestReformulation } from "@/services/templateMatcher";
import { prisma } from "@/lib/prisma";
import { appSchemaToJson } from "@/lib/schema-json";

// ─── Validation schema ────────────────────────────────────────────────────────

const generateSchema = z.object({
  prompt: z.string().min(3).max(500),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract a 3-word noun phrase from the prompt by taking the first 3 "content"
 * words (skip stop-words), capitalise each, and join with spaces.
 */
function extractNounPhrase(prompt: string): string {
  const stopWords = new Set([
    "a", "an", "the", "i", "want", "need", "build", "create", "make",
    "for", "to", "of", "with", "in", "on", "and", "or", "that", "my",
    "me", "us", "our", "your", "app", "application", "system", "tool",
  ]);

  const words = prompt
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !stopWords.has(w.toLowerCase()))
    .slice(0, 3)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  // Pad to 3 words if there are fewer meaningful words in the prompt
  while (words.length < 3) {
    words.push(["Management", "System", "Platform"][words.length] ?? "Platform");
  }

  return words.join(" ");
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<GenerateResponse>>> {
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

  const parsed = generateSchema.safeParse(body);
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

  const { prompt } = parsed.data;

  // 2. Match template
  const matchResult = matchTemplate(prompt);
  if (!matchResult) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "NO_TEMPLATE_MATCH",
          message: suggestReformulation(prompt),
        },
      },
      { status: 400 }
    );
  }

  const { template, confidence } = matchResult;

  // 3. Derive app name + slug
  const nounPhrase = extractNounPhrase(prompt);
  const generatedName = `${template.name} — ${nounPhrase}`;
  const generateSlug = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);
  const slug = generateSlug();

  // 4. Prisma transaction: org → app → runtimeSchema → schemaVersion
  try {
    const schemaJson = appSchemaToJson(template.schemaDefaults as AppSchema);

    const savedApp = await prisma.$transaction(async (tx) => {
      // 4a. Find or create the default demo organisation
      const org = await tx.organization.upsert({
        where: { slug: "oneatlas-demo" },
        update: {},
        create: {
          name: "OneAtlas Demo",
          slug: "oneatlas-demo",
        },
      });

      // 4b. Create App
      const app = await tx.app.create({
        data: {
          name: generatedName,
          slug,
          templateId: template.id,
          organizationId: org.id,
          currentSchemaVersion: 1,
        },
      });

      // 4c. Create RuntimeSchema (live, mutable)
      await tx.runtimeSchema.create({
        data: {
          appId: app.id,
          schema: schemaJson,
          version: 1,
        },
      });

      // 4d. Create SchemaVersion v1 (immutable frozen snapshot)
      await tx.schemaVersion.create({
        data: {
          appId: app.id,
          schema: schemaJson,
          version: 1,
        },
      });

      return app;
    });

    // 5. Build and return 201 response
    const responseData: GenerateResponse = {
      appId: savedApp.id,
      schema: template.schemaDefaults as AppSchema,
      templateUsed: template.id,
      generatedName,
      confidence,
    };

    return NextResponse.json({ data: responseData }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/generate] DB error:", error);
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INTERNAL_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 }
    );
  }
}
