import { PrismaClient, TemplateComplexity } from "@prisma/client";
import { templates } from "../config/templates";
import { appSchemaToJson } from "../lib/schema-json";
import type { AppTemplate } from "../types/app";

const prisma = new PrismaClient();

const COMPLEXITY_MAP: Record<
  AppTemplate["complexity"],
  TemplateComplexity
> = {
  SIMPLE: TemplateComplexity.SIMPLE,
  MODERATE: TemplateComplexity.MODERATE,
  ADVANCED: TemplateComplexity.ADVANCED,
};

async function main(): Promise<void> {
  const organization = await prisma.organization.upsert({
    where: { slug: "oneatlas-demo" },
    update: { name: "OneAtlas Demo" },
    create: {
      name: "OneAtlas Demo",
      slug: "oneatlas-demo",
    },
  });

  await prisma.user.upsert({
    where: { email: "demo@oneatlas.dev" },
    update: {},
    create: {
      email: "demo@oneatlas.dev",
      name: "Demo User",
      organizationId: organization.id,
    },
  });

  for (const template of templates) {
    const record = await prisma.template.upsert({
      where: { id: template.id },
      update: {
        name: template.name,
        slug: template.slug,
        description: template.description,
        category: template.category,
        complexity: COMPLEXITY_MAP[template.complexity],
        tags: template.tags,
        schemaDefaults: appSchemaToJson(template.schemaDefaults),
        version: template.version,
        parentTemplateId: template.parentTemplateId ?? null,
      },
      create: {
        id: template.id,
        name: template.name,
        slug: template.slug,
        description: template.description,
        category: template.category,
        complexity: COMPLEXITY_MAP[template.complexity],
        tags: template.tags,
        schemaDefaults: appSchemaToJson(template.schemaDefaults),
        version: template.version,
        parentTemplateId: template.parentTemplateId ?? null,
      },
    });

    console.log(`Seeded template: ${record.name}`);
  }

  console.log("Seed completed.");
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
