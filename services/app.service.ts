import { prisma } from "@/lib/prisma";
import { appSchemaToJson } from "@/lib/schema-json";
import type { App, AppSchema } from "@/types/app";

function toApp(record: {
  id: string;
  name: string;
  slug: string;
  templateId: string;
  currentSchemaVersion: number;
  createdAt: Date;
}): App {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    templateId: record.templateId,
    currentSchemaVersion: record.currentSchemaVersion,
    createdAt: record.createdAt.toISOString(),
  };
}

export async function listAppsByOrganization(
  organizationId: string,
): Promise<App[]> {
  const apps = await prisma.app.findMany({
    where: { organizationId },
    orderBy: { updatedAt: "desc" },
  });

  return apps.map(toApp);
}

export async function createApp(input: {
  name: string;
  slug: string;
  templateId: string;
  organizationId: string;
  initialSchema: AppSchema;
}): Promise<App> {
  const schemaJson = appSchemaToJson(input.initialSchema);

  const app = await prisma.app.create({
    data: {
      name: input.name,
      slug: input.slug,
      templateId: input.templateId,
      organizationId: input.organizationId,
      currentSchemaVersion: 1,
      runtimeSchema: {
        create: {
          schema: schemaJson,
          version: 1,
        },
      },
      schemaVersions: {
        create: {
          schema: schemaJson,
          version: 1,
        },
      },
    },
  });

  return toApp(app);
}
