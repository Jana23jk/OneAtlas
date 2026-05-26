import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MobileNav } from "./MobileNav";

/* ── Inline SVG logo icon — hexagon orbit ───────────────────────────────── */
function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      {/* Outer hexagon */}
      <path
        d="M14 2L25.26 8.5V21.5L14 28L2.74 21.5V8.5L14 2Z"
        stroke="#635BFF"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner orbit ring */}
      <circle cx="14" cy="14" r="5" stroke="#00D4B1" strokeWidth="1.5" fill="none" />
      {/* Center dot */}
      <circle cx="14" cy="14" r="2" fill="#635BFF" />
    </svg>
  );
}

/* ── Navbar (Server Component) ──────────────────────────────────────────── */
export function Navbar() {
  return (
    <header className="glass fixed left-0 right-0 top-0 z-50 border-b border-white/[0.07] px-4"
      style={{ borderRadius: 0, backdropFilter: "blur(20px)", background: "rgba(10,37,64,0.8)" }}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <LogoIcon />
          <span className="text-lg font-bold tracking-tight text-white">
            OneAtlas
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-7 md:flex">
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#8892A4] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA buttons */}
        <div className="hidden items-center gap-3 md:flex shrink-0">
          <Link
            href="/generate"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/generate"
            className="rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#635BFF]/25 transition-all hover:bg-[#7a73ff] hover:shadow-[#635BFF]/40"
          >
            Start Building →
          </Link>
        </div>

        {/* Mobile: client component handles interactivity */}
        <div className="relative md:hidden">
          <MobileNav links={siteConfig.navLinks} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
