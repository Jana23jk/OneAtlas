import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Templates", href: "/templates" },
    { label: "Generate", href: "/generate" },
    { label: "Runtime", href: "/runtime" },
  ],
  Resources: [
    { label: "Docs", href: "/docs" },
    { label: "API Reference", href: "/docs#api" },
    { label: "Security", href: "/security" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "/security" },
  ],
} as const;

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-surface-border bg-white/50">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden>
                <path d="M14 2L25.26 8.5V21.5L14 28L2.74 21.5V8.5L14 2Z" stroke="#7A73FF" strokeWidth="1.5" fill="none" />
                <circle cx="14" cy="14" r="5" stroke="#7A73FF" strokeWidth="1.5" fill="none" />
                <circle cx="14" cy="14" r="2" fill="#7A73FF" />
              </svg>
              <span className="text-base font-bold text-text-primary">OneAtlas</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-text-secondary">
              Build internal tools at the speed of thought. Metadata-driven runtime for modern teams.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-text-secondary transition-all hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary"
            >
              <GitHubIcon />
            </a>
          </div>

          {(Object.entries(footerLinks) as [string, readonly { label: string; href: string }[]][]).map(
            ([col, links]) => (
              <div key={col} className="flex flex-col gap-4">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  {col}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-secondary transition-colors hover:text-brand-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-surface-border pt-8 sm:flex-row">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} OneAtlas, Inc. All rights reserved.
          </p>
          <p className="text-xs text-text-secondary">
            Built with Next.js 15 · Prisma · Neon
          </p>
        </div>
      </div>
    </footer>
  );
}
