import { cn } from "@/lib/utils";
import type { DeploymentStatus } from "./types";
import { STATUS_COLORS } from "./types";

interface DeployMetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  status?: DeploymentStatus;
  icon?: React.ReactNode;
  className?: string;
}

export function DeployMetricCard({
  label,
  value,
  sublabel,
  status,
  icon,
  className,
}: DeployMetricCardProps) {
  return (
    <div className={cn("deploy-metric-card reveal", className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-[#667085]">{label}</span>
        {icon ? (
          <span
            className="rounded-xl p-2"
            style={
              status
                ? { backgroundColor: `${STATUS_COLORS[status]}18`, color: STATUS_COLORS[status] }
                : { backgroundColor: "rgba(99, 91, 255, 0.1)", color: "#635BFF" }
            }
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-2xl font-bold text-[#1A1F36]">{value}</p>
      {sublabel ? (
        <p className="mt-1 text-xs font-medium text-[#667085]">{sublabel}</p>
      ) : null}
      {status ? (
        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              status === "running" && "status-pulse-dot status-pulse-running",
              status === "success" && "status-pulse-dot status-pulse-success",
            )}
            style={{ backgroundColor: STATUS_COLORS[status] }}
          />
          <span className="text-xs font-semibold capitalize" style={{ color: STATUS_COLORS[status] }}>
            {status}
          </span>
        </div>
      ) : null}
    </div>
  );
}
