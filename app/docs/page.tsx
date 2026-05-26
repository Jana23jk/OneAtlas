import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    title: "Getting Started",
    body: "Learn how to create your first AI-generated application using OneAtlas.",
    items: [
      "Set up your database connection",
      "Choose a template or generate from a prompt",
      "Customize your schema using natural language",
      "Deploy to the runtime environment",
    ],
  },
  {
    title: "Templates",
    body: "Browse our collection of pre-built templates for common use cases.",
    items: [
      "CRM Workspace — Customer relationship management",
      "HR Dashboard — Employee management and analytics",
      "Admin Panel — User and permission management",
      "Inventory System — Stock tracking and logistics",
      "Analytics Workspace — KPI tracking and reporting",
    ],
  },
  {
    title: "API Reference",
    body: "Integrate OneAtlas into your workflow using our REST API.",
    items: [
      "POST /api/generate — Generate an app from a prompt",
      "POST /api/edit — Edit an app schema using natural language",
      "POST /api/preview — Create a preview snapshot",
      "GET /api/health — Check service health",
    ],
    code: true,
  },
  {
    title: "Schema Mutations",
    body: "Modify your app schema using structured mutation operations.",
    items: [
      "add_field — Add a new field to a component",
      "remove_field — Remove a field from a component",
      "rename_field — Rename an existing field",
      "update_component_prop — Update component properties",
      "reorder_components — Change component order",
    ],
  },
];

export default function DocsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">
        <SectionHeader
          align="left"
          eyebrow="Documentation"
          title="Build with OneAtlas"
          description="Guides, API reference, and schema mutation docs for your team."
        />

        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.title} hover={false}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <p className="text-sm text-text-secondary">{section.body}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                      {section.code ? (
                        <code className="rounded-lg border border-surface-border bg-surface-bg px-2 py-0.5 font-mono text-xs text-text-primary">
                          {item}
                        </code>
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="info">REST API</Badge>
          <Badge variant="success">Prisma</Badge>
          <Badge variant="default">Next.js 15</Badge>
        </div>
      </div>
    </PageShell>
  );
}
