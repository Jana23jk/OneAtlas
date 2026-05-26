"use client";

import {
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import type { DeploymentRecord, DeploymentStatus } from "./types";
import { STATUS_COLORS } from "./types";
import { cn } from "@/lib/utils";

const statusIcons: Record<DeploymentStatus, React.ReactNode> = {
  success: <CheckCircle2 size={18} />,
  running: <Loader2 size={18} className="animate-spin" />,
  pending: <Clock size={18} />,
  failed: <XCircle size={18} />,
};

interface DeploymentTimelineProps {
  deployments: DeploymentRecord[];
}

export function DeploymentTimeline({ deployments }: DeploymentTimelineProps) {
  return (
    <div className="space-y-4">
      {deployments.map((dep, i) => (
        <article
          key={dep.id}
          className="deploy-timeline-card reveal"
          style={{
            borderLeftColor: STATUS_COLORS[dep.status],
            animationDelay: `${i * 0.06}s`,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `${STATUS_COLORS[dep.status]}18`,
                  color: STATUS_COLORS[dep.status],
                }}
              >
                {statusIcons[dep.status]}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-mono text-sm font-semibold text-[#0A2540]">{dep.id}</h4>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    )}
                    style={{
                      backgroundColor: `${STATUS_COLORS[dep.status]}18`,
                      color: STATUS_COLORS[dep.status],
                    }}
                  >
                    {dep.status}
                  </span>
                  <span className="rounded-full border border-[#E7EAF5] bg-[#FAFBFF] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#667085]">
                    {dep.environment}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#0A2540]">{dep.commitMessage}</p>
                <p className="mt-2 text-xs text-[#667085]">
                  {dep.user} · Build {dep.buildDuration}
                </p>
              </div>
            </div>
            <time className="shrink-0 text-xs font-medium text-[#667085]">
              {new Date(dep.timestamp).toLocaleString()}
            </time>
          </div>
        </article>
      ))}
    </div>
  );
}
