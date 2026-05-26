import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { jsonToAppSchema } from "@/lib/schema-json";
import type { AppSchema, MutationLogEntry } from "@/types/app";
import { BuilderClient } from "./BuilderClient";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  // 1. Fetch App with runtime schema
  const appRecord = await prisma.app.findUnique({
    where: { id: appId },
    include: {
      runtimeSchema: true,
    },
  });

  if (!appRecord || !appRecord.runtimeSchema) {
    notFound();
  }

  // 2. Fetch edit history (mutation logs)
  const logs = await prisma.mutationLog.findMany({
    where: { appId },
    orderBy: { createdAt: "asc" },
  });

  // 3. Convert JSON to typesafe models
  const schema: AppSchema = jsonToAppSchema(appRecord.runtimeSchema.schema);
  const history: MutationLogEntry[] = logs.map((log) => ({
    id: log.id,
    instruction: log.instruction,
    mutationType: log.mutationType,
    resultSummary: log.resultSummary,
    success: log.success,
    schemaVersionAfter: log.schemaVersionAfter,
    createdAt: log.createdAt.toISOString(),
  }));

  return (
    <BuilderClient
      appId={appRecord.id}
      appName={appRecord.name}
      schema={schema}
      initialHistory={history}
    />
  );
}
