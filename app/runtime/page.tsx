import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default function RuntimePage() {
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
        <div className="glass max-w-2xl p-10">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Runtime Environment
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Deploy and manage your AI-generated applications in a secure runtime environment.
          </p>
          <div className="mt-8">
            <Button>Create New App</Button>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold text-white">
            Your Applications
          </h2>
          <div className="card p-8 text-center">
            <p className="text-white/60">
              No applications yet. Create your first app to get started.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
