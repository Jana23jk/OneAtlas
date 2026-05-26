import Link from "next/link";

const footerLinks = {
  Product:   [
    { label: "Templates",  href: "#templates" },
    { label: "Pricing",    href: "#pricing" },
    { label: "Changelog",  href: "/changelog" },
    { label: "Roadmap",    href: "/roadmap" },
  ],
  Resources: [
    { label: "Docs",           href: "/docs" },
    { label: "API Reference",  href: "/docs/api" },
    { label: "Examples",       href: "/examples" },
    { label: "Blog",           href: "/blog" },
  ],
  Legal: [
    { label: "Privacy",  href: "/privacy" },
    { label: "Terms",    href: "/terms" },
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

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
    </svg>
  );
}

const socials = [
  { label: "GitHub",  href: "https://github.com",  Icon: GitHubIcon  },
  { label: "Twitter", href: "https://twitter.com",  Icon: TwitterIcon },
  { label: "Discord", href: "https://discord.com",  Icon: DiscordIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] mt-8">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden>
                <path d="M14 2L25.26 8.5V21.5L14 28L2.74 21.5V8.5L14 2Z" stroke="#635BFF" strokeWidth="1.5" fill="none" />
                <circle cx="14" cy="14" r="5" stroke="#00D4B1" strokeWidth="1.5" fill="none" />
                <circle cx="14" cy="14" r="2" fill="#635BFF" />
              </svg>
              <span className="text-base font-bold text-white">OneAtlas</span>
            </div>
            <p className="text-sm leading-relaxed text-[#8892A4] max-w-xs">
              Build internal tools at the speed of thought. Metadata-driven runtime for modern teams.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-2">
              {socials.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#8892A4] transition-all hover:border-white/30 hover:text-white">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {(Object.entries(footerLinks) as [string, readonly { label: string; href: string }[]][]).map(([col, links]) => (
            <div key={col} className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#8892A4]">{col}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-8 sm:flex-row">
          <p className="text-xs text-[#8892A4]">
            © {new Date().getFullYear()} OneAtlas, Inc. All rights reserved.
          </p>
          <p className="text-xs text-[#8892A4]">
            Built with Next.js 15 · Prisma · Neon
          </p>
        </div>
      </div>
    </footer>
  );
}
