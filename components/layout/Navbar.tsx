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

interface NavbarProps {
  light?: boolean;
}

export function Navbar({ light = false }: NavbarProps) {
  const headerBg = light ? "rgba(255, 255, 255, 0.8)" : "rgba(10, 37, 64, 0.8)";
  const headerBorder = light ? "border-[#635BFF]/10" : "border-white/[0.07]";
  const logoText = light ? "text-[#0A2540]" : "text-white";
  const linkText = light ? "text-[#475467] hover:text-[#635BFF]" : "text-[#8892A4] hover:text-white";
  const signInBtn = light 
    ? "border-[#635BFF]/20 text-[#475467] hover:border-[#635BFF]/40 hover:text-[#635BFF] hover:bg-[#635BFF]/5" 
    : "border-white/20 text-white/80 hover:border-white/40 hover:text-white";
  const startBuildingBtn = light
    ? "bg-gradient-to-r from-[#635BFF] to-[#7A73FF] text-white shadow-md shadow-[#635BFF]/10 hover:shadow-lg hover:shadow-[#635BFF]/20 hover:-translate-y-0.5"
    : "bg-[#635BFF] text-white shadow-lg shadow-[#635BFF]/25 hover:bg-[#7a73ff] hover:shadow-[#635BFF]/40";

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 border-b px-4 transition-all duration-300 ${headerBorder}`}
      style={{ borderRadius: 0, backdropFilter: "blur(16px)", background: headerBg }}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <LogoIcon />
          <span className={`text-lg font-bold tracking-tight transition-colors ${logoText}`}>
            OneAtlas
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-7 md:flex">
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors ${linkText}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA buttons */}
        <div className="hidden items-center gap-3 md:flex shrink-0">
          <Link
            href="/generate"
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${signInBtn}`}
          >
            Sign In
          </Link>
          <Link
            href="/generate"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${startBuildingBtn}`}
          >
            Start Building →
          </Link>
        </div>

        {/* Mobile: client component handles interactivity */}
        <div className="relative md:hidden">
          <MobileNav links={siteConfig.navLinks} light={light} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
