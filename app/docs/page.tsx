import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-[var(--color-primary-light)]">
            {siteConfig.name}
          </Link>
          <nav className="flex gap-6">
            {siteConfig.navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">
          Documentation
        </h1>

        <div className="space-y-8">
          <article className="card p-6">
            <h2 className="mb-3 text-xl font-semibold text-white">
              Getting Started
            </h2>
            <p className="mb-4 text-white/70">
              Learn how to create your first AI-generated application using OneAtlas.
            </p>
            <ul className="list-inside list-disc space-y-2 text-white/60">
              <li>Set up your database connection</li>
              <li>Choose a template or generate from a prompt</li>
              <li>Customize your schema using natural language</li>
              <li>Deploy to the runtime environment</li>
            </ul>
          </article>

          <article className="card p-6">
            <h2 className="mb-3 text-xl font-semibold text-white">
              Templates
            </h2>
            <p className="mb-4 text-white/70">
              Browse our collection of pre-built templates for common use cases.
            </p>
            <ul className="list-inside list-disc space-y-2 text-white/60">
              <li>CRM Workspace - Customer relationship management</li>
              <li>HR Dashboard - Employee management and analytics</li>
              <li>Admin Panel - User and permission management</li>
              <li>Inventory System - Stock tracking and logistics</li>
              <li>Analytics Workspace - KPI tracking and reporting</li>
            </ul>
          </article>

          <article className="card p-6">
            <h2 className="mb-3 text-xl font-semibold text-white">
              API Reference
            </h2>
            <p className="mb-4 text-white/70">
              Integrate OneAtlas into your workflow using our REST API.
            </p>
            <ul className="list-inside list-disc space-y-2 text-white/60">
              <li>
                <code className="rounded bg-white/10 px-2 py-1 text-sm">
                  POST /api/generate
                </code>{" "}
                - Generate an app from a prompt
              </li>
              <li>
                <code className="rounded bg-white/10 px-2 py-1 text-sm">
                  POST /api/edit
                </code>{" "}
                - Edit an app schema using natural language
              </li>
              <li>
                <code className="rounded bg-white/10 px-2 py-1 text-sm">
                  POST /api/preview
                </code>{" "}
                - Create a preview snapshot
              </li>
              <li>
                <code className="rounded bg-white/10 px-2 py-1 text-sm">
                  GET /api/health
                </code>{" "}
                - Check service health
              </li>
            </ul>
          </article>

          <article className="card p-6">
            <h2 className="mb-3 text-xl font-semibold text-white">
              Schema Mutations
            </h2>
            <p className="mb-4 text-white/70">
              Modify your app schema using structured mutation operations.
            </p>
            <ul className="list-inside list-disc space-y-2 text-white/60">
              <li>add_field - Add a new field to a component</li>
              <li>remove_field - Remove a field from a component</li>
              <li>rename_field - Rename an existing field</li>
              <li>update_component_prop - Update component properties</li>
              <li>reorder_components - Change component order</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
