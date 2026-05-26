import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  ArrowRight,
  Globe,
  Rocket,
  Server,
  Zap,
} from "lucide-react";
import { DeployMetricCard } from "@/components/deploy/DeployMetricCard";

export default async function RuntimePage() {
  const apps = await prisma.app.findMany({
    take: 12,
    orderBy: { updatedAt: "desc" },
    include: {
      template: true,
      runtimeSchema: true,
      _count: { select: { previewSnapshots: true } },
    },
  });

  return (
    <DashboardShell>
      <div className="deploy-page-bg relative z-10 h-full overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-10 px-6 py-10 pb-16 animate-fade-in-up">
          <header className="reveal space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#635BFF]">
              Runtime & deploy
            </p>
            <h1 className="text-3xl font-bold text-[#1A1F36]">Deployment center</h1>
            <p className="max-w-2xl text-sm text-[#667085]">
              Manage live applications, monitor environments, and ship schema updates to the
              OneAtlas edge runtime.
            </p>
          </header>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 reveal-delay-1">
            <DeployMetricCard
              label="Active apps"
              value={String(apps.length)}
              sublabel="Registered in workspace"
              status="success"
              icon={<Server size={18} />}
            />
            <DeployMetricCard
              label="Deployments"
              value={String(apps.reduce((n, a) => n + a._count.previewSnapshots, 0))}
              sublabel="Total preview snapshots"
              icon={<Zap size={18} />}
            />
            <DeployMetricCard
              label="Production"
              value="99.9%"
              sublabel="Platform uptime"
              status="running"
              icon={<Globe size={18} />}
            />
            <DeployMetricCard
              label="Edge regions"
              value="12"
              sublabel="Global distribution"
              icon={<Rocket size={18} />}
            />
          </div>

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1F36]">Your applications</h2>
              <p className="text-sm text-[#667085]">
                Open the deployment dashboard for any app to view timeline, logs, and status.
              </p>
            </div>

            {apps.length === 0 ? (
              <div className="dashboard-card flex flex-col items-center gap-4 py-14 text-center">
                <p className="text-sm text-[#667085]">
                  No applications yet. Generate your first app to get started.
                </p>
                <Link href="/generate" className="btn-deploy-primary">
                  <Rocket size={16} />
                  Create new app
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {apps.map((app) => (
                  <Link
                    key={app.id}
                    href={`/deploy/${app.id}`}
                    className="dashboard-card group flex items-center justify-between gap-4 transition-all hover:-translate-y-1"
                  >
                    <div>
                      <h3 className="font-bold text-[#1A1F36] group-hover:text-[#635BFF] transition-colors">
                        {app.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#667085]">
                        {app.template.name}
                        {app.runtimeSchema ? ` · v${app.runtimeSchema.version}` : ""}
                        {" · "}
                        {app._count.previewSnapshots} deployments
                      </p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(99, 91, 255,0.1)] text-[#635BFF] transition-transform group-hover:translate-x-1">
                      <ArrowRight size={18} />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
