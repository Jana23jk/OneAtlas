import { prisma } from "@/lib/prisma";
import { jsonToAppSchema } from "@/lib/schema-json";
import { PreviewNotFound } from "@/components/preview/PreviewNotFound";
import { PreviewExpired } from "@/components/preview/PreviewExpired";
import { PreviewEnvironment } from "@/components/preview/PreviewEnvironment";
import type { AppSchema } from "@/types/app";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const snapshot = await prisma.previewSnapshot.findUnique({
    where: { token },
    include: {
      app: {
        include: {
          template: true,
        },
      },
    },
  });

  if (!snapshot) {
    return <PreviewNotFound />;
  }

  const isExpired = snapshot.expiresAt && new Date(snapshot.expiresAt) < new Date();
  const isRevoked = snapshot.revokedAt !== null;

  if (isExpired || isRevoked) {
    return <PreviewExpired />;
  }

  const schema: AppSchema = jsonToAppSchema(snapshot.schema);
  const previewUrl = `/preview/${token}`;

  return (
    <PreviewEnvironment
      schema={schema}
      appName={snapshot.app.name}
      templateName={snapshot.app.template.name}
      previewUrl={previewUrl}
      createdAt={snapshot.createdAt.toISOString()}
      schemaVersion={schema.version}
    />
  );
}
