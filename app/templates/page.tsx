import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { templates } from "@/config/templates";

export default function TemplatesPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-[var(--color-primary-light)]">
            {siteConfig.name}
          </Link>
          <nav className="flex gap-6">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Templates
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Start with a pre-built template and customize it to your needs
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <article key={template.id} className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs text-[var(--color-accent-teal)]">
                  {template.category}
                </span>
                <span className="text-xs text-white/40">
                  {template.complexity}
                </span>
              </div>
              <h2 className="mb-2 font-semibold text-white">{template.name}</h2>
              <p className="mb-4 text-sm text-white/60">
                {template.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 px-2 py-1 text-xs text-white/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button className="w-full">Use Template</Button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
