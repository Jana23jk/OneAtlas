import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, CheckCircle2 } from "lucide-react";

const standards = [
  "SOC 2 Type II aligned controls",
  "Encryption at rest and in transit",
  "Role-based access control",
  "Audit logs for schema mutations",
  "Neon PostgreSQL isolation",
  "Preview token revocation",
];

export default function SecurityPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-card border border-brand-primary/20 bg-brand-primary/10 text-brand-primary">
            <Shield size={28} />
          </div>
          <SectionHeader
            eyebrow="Trust & safety"
            title="Security & Compliance"
            description="How OneAtlas secures your generated applications, schema snapshots, and metadata infrastructure."
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card hover={false}>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                <Lock size={20} />
              </div>
              <CardTitle>Isolated runtimes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-text-secondary">
                Every sandbox app execution and schema change is verified against
                isolated relational constraints to guarantee secure boundaries.
              </p>
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                <Eye size={20} />
              </div>
              <CardTitle>Frozen snapshots</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-text-secondary">
                Public preview tokens use immutable snapshot schemas. Changes to
                apps do not alter existing tokens without explicit revocation.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card hover={false}>
          <CardHeader>
            <CardTitle>Platform standards</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-2">
              {standards.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-text-secondary"
                >
                  <CheckCircle2 size={16} className="shrink-0 text-brand-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
