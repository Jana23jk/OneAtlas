import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
import TemplatesClient from "./TemplatesClient";

export default function TemplatesPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-16">
        <SectionHeader
          align="left"
          eyebrow="Template library"
          title="Operational app systems for every team"
          description="Pre-designed data schemas, charts, and metrics. Start from a template or customize with AI."
        />

        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          }
        >
          <TemplatesClient />
        </Suspense>
      </div>
    </PageShell>
  );
}
