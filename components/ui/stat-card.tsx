import { cn } from "@/lib/utils";
import { Card } from "./card";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  variant?: "default" | "success" | "info" | "warning" | "cta";
  icon?: React.ReactNode;
}

const variantClasses = {
  default: "text-brand-primary",
  success: "stat-success",
  info: "stat-info",
  warning: "stat-warning",
  cta: "stat-cta",
};

export function StatCard({
  label,
  value,
  change,
  variant = "default",
  icon,
}: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        {icon ? (
          <span className={cn("rounded-lg bg-brand-primary/10 p-2", variantClasses[variant])}>
            {icon}
          </span>
        ) : null}
      </div>
      <p className={cn("text-3xl font-bold", variantClasses[variant])}>{value}</p>
      {change ? (
        <p className="text-xs text-text-secondary">{change}</p>
      ) : null}
    </Card>
  );
}
