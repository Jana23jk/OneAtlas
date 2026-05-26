import { DashboardShell } from "@/components/layout/DashboardShell";

export default function DeployLoading() {
  return (
    <DashboardShell>
      <div className="deploy-page-bg h-full p-8">
        <div className="mx-auto max-w-7xl space-y-8 animate-fade-in-up">
          <div className="h-10 w-64 animate-shimmer rounded-lg" />
          <div className="h-6 w-96 animate-shimmer rounded-lg" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-shimmer rounded-2xl" />
            ))}
          </div>
          <div className="h-64 animate-shimmer rounded-2xl" />
        </div>
      </div>
    </DashboardShell>
  );
}
