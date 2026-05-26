"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Globe,
  Loader2,
  Rocket,
  Search,
  Server,
  Users,
  Zap,
} from "lucide-react";
import { DeployMetricCard } from "./DeployMetricCard";
import { DeploymentTimeline } from "./DeploymentTimeline";
import { BuildLogPanel } from "./BuildLogPanel";
import type { DeploymentRecord, DeployEnvironment } from "./types";

interface DeployCenterClientProps {
  appId: string;
  appName: string;
  schemaVersion: number;
  templateName: string;
  updatedAt: string;
  snapshotCount: number;
  initialDeployments: DeploymentRecord[];
}

const ENVIRONMENTS: DeployEnvironment[] = ["production", "staging", "development"];

const SAMPLE_LOGS = [
  { level: "info" as const, text: "[build] Initializing OneAtlas runtime compiler v2.4.1" },
  { level: "info" as const, text: "[build] Resolving schema version and component graph..." },
  { level: "success" as const, text: "[build] ✓ Schema validation passed (42 components)" },
  { level: "info" as const, text: "[build] Compiling UI routes and data bindings..." },
  { level: "warn" as const, text: "[build] Deprecated field mapping on table:contacts — auto-migrated" },
  { level: "success" as const, text: "[build] ✓ Edge bundle generated (1.2 MB gzipped)" },
  { level: "info" as const, text: "[deploy] Provisioning preview tokens and runtime endpoints..." },
  { level: "success" as const, text: "[deploy] ✓ Deployment registered on global edge network" },
  { level: "muted" as const, text: "[deploy] Live URL ready — handshake complete in 4.2s" },
];

export function DeployCenterClient({
  appId,
  appName,
  schemaVersion,
  templateName,
  updatedAt,
  snapshotCount,
  initialDeployments,
}: DeployCenterClientProps) {
  const [environment, setEnvironment] = useState<DeployEnvironment>("production");
  const [search, setSearch] = useState("");
  const [deploying, setDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [lastDeployedAt, setLastDeployedAt] = useState<string | null>(
    initialDeployments[0]?.timestamp ?? null,
  );

  const filteredDeployments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialDeployments.filter((d) => {
      const envMatch = d.environment === environment;
      if (!q) return envMatch;
      return (
        envMatch &&
        (d.id.toLowerCase().includes(q) ||
          d.commitMessage.toLowerCase().includes(q) ||
          d.user.toLowerCase().includes(q))
      );
    });
  }, [initialDeployments, environment, search]);

  const latestStatus = initialDeployments.find((d) => d.environment === environment)?.status ?? "success";

  const handleDeploy = async () => {
    setDeploying(true);
    setDeployProgress(0);
    const steps = [15, 35, 60, 85, 100];
    for (const p of steps) {
      await new Promise((r) => setTimeout(r, 500));
      setDeployProgress(p);
    }
    await fetch(`/api/apps/${appId}/preview`, { method: "POST" });
    setLastDeployedAt(new Date().toISOString());
    setDeploying(false);
    setDeployProgress(0);
  };

  return (
    <div className="deploy-page-bg relative z-10 h-full overflow-y-auto">
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-8 pb-16 animate-fade-in-up">
        {/* Top section */}
        <header className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Link
              href={`/builder/${appId}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#667085] transition-colors hover:text-[#635BFF]"
            >
              <ArrowLeft size={16} />
              Back to builder
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#635BFF]">
                Deployment center
              </p>
              <h1 className="mt-1 text-3xl font-bold text-[#1A1F36]">{appName}</h1>
              <p className="mt-1 text-sm text-[#667085]">
                {templateName} · Schema v{schemaVersion} · {snapshotCount} preview snapshots
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex rounded-xl border border-[#E7EAF5] bg-white p-1 shadow-sm">
              {ENVIRONMENTS.map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => setEnvironment(env)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                    environment === env
                      ? "bg-gradient-to-r from-[#635BFF] to-[#544cf4] text-white shadow-md"
                      : "text-[#667085] hover:bg-[#FAFBFF] hover:text-[#1A1F36]"
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
              />
              <input
                type="search"
                placeholder="Search deployments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-premium h-10 w-full min-w-[200px] pl-9 py-2 text-sm sm:w-56"
              />
            </div>
            <button
              type="button"
              onClick={handleDeploy}
              disabled={deploying}
              className="btn-deploy-primary shrink-0 disabled:opacity-70"
            >
              {deploying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deploying…
                </>
              ) : (
                <>
                  <Rocket size={16} />
                  Deploy
                </>
              )}
            </button>
          </div>
        </header>

        {/* Last deployment + status strip */}
        <div className="reveal reveal-delay-1 dashboard-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-3 w-3 rounded-full ${
                deploying ? "status-pulse-dot status-pulse-running" : "status-pulse-dot status-pulse-success"
              }`}
              style={{ backgroundColor: deploying ? "#635BFF" : "#00D4B1" }}
            />
            <div>
              <p className="text-sm font-semibold text-[#1A1F36]">
                {deploying ? "Deployment in progress…" : `${environment} is live`}
              </p>
              <p className="text-xs text-[#667085]">
                Last deployment:{" "}
                {lastDeployedAt
                  ? new Date(lastDeployedAt).toLocaleString()
                  : "No deployments yet"}
                {" · "}
                Updated {new Date(updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/run/${appId}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7EAF5] bg-[#FAFBFF] px-3 py-2 text-xs font-semibold text-[#1A1F36] transition-colors hover:border-[#635BFF]/30"
            >
              <Globe size={14} />
              Open live app
            </Link>
            <span
              className="rounded-full px-3 py-1 text-xs font-bold capitalize"
              style={{
                backgroundColor: latestStatus === "success" ? "rgba(0, 212, 177, 0.12)" : "rgba(99, 91, 255, 0.12)",
                color: latestStatus === "success" ? "#00D4B1" : "#635BFF",
              }}
            >
              {latestStatus}
            </span>
          </div>
          {deploying ? (
            <div className="w-full">
              <div className="h-2 overflow-hidden rounded-full bg-[#E7EAF5]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#635BFF] to-[#544cf4] transition-all duration-500"
                  style={{ width: `${deployProgress}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Metric cards */}
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <DeployMetricCard
            label="Production"
            value="Live"
            sublabel="Primary environment"
            status="success"
            icon={<Globe size={18} />}
            className="reveal-delay-1"
          />
          <DeployMetricCard
            label="Staging"
            value="Ready"
            sublabel="Pre-release channel"
            status="running"
            icon={<Server size={18} />}
            className="reveal-delay-1"
          />
          <DeployMetricCard
            label="Build time"
            value="4.2s"
            sublabel="Last successful build"
            icon={<Zap size={18} />}
            className="reveal-delay-2"
          />
          <DeployMetricCard
            label="Deployment time"
            value="12s"
            sublabel="Edge propagation"
            icon={<Clock size={18} />}
            className="reveal-delay-2"
          />
          <DeployMetricCard
            label="Active users"
            value="128"
            sublabel="+12% this week"
            icon={<Users size={18} />}
            className="reveal-delay-2"
          />
          <DeployMetricCard
            label="Current version"
            value={`v${schemaVersion}`}
            sublabel="Runtime schema"
            icon={<Rocket size={18} />}
            className="reveal-delay-3"
          />
          <DeployMetricCard
            label="Development"
            value="Synced"
            sublabel="Latest commit deployed"
            status="pending"
            icon={<Server size={18} />}
            className="reveal-delay-3"
          />
          <DeployMetricCard
            label="Snapshots"
            value={String(snapshotCount)}
            sublabel="Preview tokens issued"
            status="success"
            icon={<Globe size={18} />}
            className="reveal-delay-3"
          />
        </section>

        {/* Timeline + logs */}
        <div className="grid gap-8 lg:grid-cols-5">
          <section className="lg:col-span-3 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1F36]">Deployment timeline</h2>
              <p className="text-sm text-[#667085]">
                Recent releases for <span className="font-medium capitalize">{environment}</span>
              </p>
            </div>
            {filteredDeployments.length > 0 ? (
              <DeploymentTimeline deployments={filteredDeployments} />
            ) : (
              <div className="dashboard-card py-12 text-center">
                <p className="text-sm text-[#667085]">No deployments match your search.</p>
              </div>
            )}
          </section>
          <section className="lg:col-span-2">
            <BuildLogPanel lines={SAMPLE_LOGS} />
          </section>
        </div>
      </div>
    </div>
  );
}
