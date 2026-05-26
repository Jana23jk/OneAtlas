import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Play, Server, Zap } from "lucide-react";

export default function RuntimePage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-16">
        <SectionHeader
          align="left"
          eyebrow="Runtime"
          title="Deploy and manage your apps"
          description="Secure runtime environment for AI-generated applications with live schema sync."
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <StatCard label="Active apps" value="0" variant="info" icon={<Server size={18} />} />
          <StatCard label="Deployments" value="0" variant="success" icon={<Zap size={18} />} />
          <StatCard label="Uptime" value="99.9%" variant="default" icon={<Play size={18} />} />
        </div>

        <Card hover={false}>
          <CardHeader>
            <CardTitle>Your applications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <p className="text-text-secondary">
              No applications yet. Generate your first app to get started.
            </p>
            <Button asChild>
              <Link href="/generate">Create New App</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
