import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DeployCenterClient } from "@/components/deploy/DeployCenterClient";
import type { DeploymentRecord } from "@/components/deploy/types";

function buildDeployments(
  appName: string,
  snapshots: { id: string; createdAt: Date; token: string }[],
  schemaVersion: number,
): DeploymentRecord[] {
  const envs = ["production", "staging", "development"] as const;
  const statuses = ["success", "success", "running", "pending", "failed"] as const;

  const fromSnapshots: DeploymentRecord[] = snapshots.map((snap, i) => ({
    id: `dep_${snap.token.slice(0, 8)}`,
    timestamp: snap.createdAt.toISOString(),
    environment: envs[i % envs.length],
    status: statuses[i % statuses.length],
    user: "OneAtlas CI",
    commitMessage: `Deploy ${appName} · schema v${schemaVersion - (i % 2)}`,
    buildDuration: `${3 + (i % 4)}.${i}s`,
  }));

  if (fromSnapshots.length > 0) return fromSnapshots;

  return [
    {
      id: "dep_initial",
      timestamp: new Date().toISOString(),
      environment: "production",
      status: "success",
      user: "System",
      commitMessage: `Initial deployment for ${appName}`,
      buildDuration: "4.2s",
    },
  ];
}

export default async function DeployPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  const appRecord = await prisma.app.findUnique({
    where: { id: appId },
    include: {
      template: true,
      runtimeSchema: true,
      previewSnapshots: {
        orderBy: { createdAt: "desc" },
        take: 8,
      },
    },
  });

  if (!appRecord || !appRecord.runtimeSchema) {
    notFound();
  }

  const deployments = buildDeployments(
    appRecord.name,
    appRecord.previewSnapshots,
    appRecord.runtimeSchema.version,
  );

  return (
    <DashboardShell appId={appId}>
      <DeployCenterClient
        appId={appRecord.id}
        appName={appRecord.name}
        schemaVersion={appRecord.runtimeSchema.version}
        templateName={appRecord.template.name}
        updatedAt={appRecord.updatedAt.toISOString()}
        snapshotCount={appRecord.previewSnapshots.length}
        initialDeployments={deployments}
      />
    </DashboardShell>
  );
}
