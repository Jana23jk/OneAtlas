import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { templates } from "@/config/templates";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-semibold text-[var(--color-primary-light)]">
            {siteConfig.name}
          </span>
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
        <div className="glass max-w-2xl p-10">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Build apps with AI-native runtime
          </h1>
          <p className="mt-4 text-lg text-white/70">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex gap-4">
            <Button>Get started</Button>
            <Button variant="outline">View templates</Button>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <article key={template.id} className="card p-6">
              <h2 className="font-semibold text-white">{template.name}</h2>
              <p className="mt-2 text-sm text-white/60">
                {template.description}
              </p>
              <span className="mt-4 inline-block text-xs text-[var(--color-accent-teal)]">
                {template.category}
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
